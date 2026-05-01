/* eslint-disable @typescript-eslint/no-explicit-any */
import { analyticsRouter } from "@/features/analytics/server/routers";
import prisma from "@/lib/db";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    topicPerformance: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
      findFirst: jest.fn(),
    },
    topic: {
      aggregate: jest.fn(),
    },
    question: {
      aggregate: jest.fn(),
      count: jest.fn(),
    },
    answer: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/cache", () => ({
  getOrSetCache: jest.fn((_, fn) => fn()),
}));

const createCaller = () => {
  return analyticsRouter.createCaller({
    auth: {
      user: { id: "user-1" },
    },
  } as any);
};

describe("analyticsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWeakTopics", () => {
    it("returns weakest topics", async () => {
      (prisma.topicPerformance.findMany as jest.Mock).mockResolvedValue([
        {
          topicId: "t1",
          accuracy: 0.5,
          avgScore: 4,
          attemptCount: 10,
          topic: { name: "arrays" },
        },
      ]);

      const caller = createCaller();
      const result = await caller.getWeakTopics();

      expect(result).toEqual([
        {
          topicId: "t1",
          topicName: "arrays",
          accuracy: 0.5,
          avgScore: 4,
          attemptCount: 10,
        },
      ]);
    });
  });

  describe("getDashboard", () => {
    it("returns dashboard stats", async () => {
      (prisma.topic.aggregate as jest.Mock).mockResolvedValue({
        _count: { id: 2 },
      });

      (prisma.question.aggregate as jest.Mock).mockResolvedValue({
        _count: { id: 5 },
      });

      (prisma.answer.aggregate as jest.Mock).mockResolvedValue({
        _count: { id: 10 },
      });

      (prisma.topicPerformance.aggregate as jest.Mock)
        .mockResolvedValueOnce({
          _avg: {
            avgScore: 6,
            accuracy: 0.7,
            attemptCount: 3,
          },
        })
        .mockResolvedValueOnce({
          _sum: { attemptCount: 30 },
        });

      (prisma.topicPerformance.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          topicId: "t1",
          accuracy: 0.9,
          avgScore: 9,
          topic: { name: "dp" },
        })
        .mockResolvedValueOnce({
          topicId: "t2",
          accuracy: 0.3,
          avgScore: 3,
          topic: { name: "graphs" },
        });

      const caller = createCaller();
      const result = await caller.getDashboard();

      expect(result.totalTopics).toBe(2);
      expect(result.totalQuestions).toBe(5);
      expect(result.totalAnswers).toBe(10);
      expect(result.averageScore).toBe(6);
      expect(result.averageAccuracy).toBe(0.7);
      expect(result.totalAttempts).toBe(30);
      expect(result.bestTopic?.topicName).toBe("dp");
      expect(result.weakestTopic?.topicName).toBe("graphs");
    });
  });

  describe("getRecentAnswers", () => {
    it("returns recent answers", async () => {
      (prisma.answer.findMany as jest.Mock).mockResolvedValue([
        {
          id: "a1",
          content: "answer",
          status: "COMPLETED",
          statusMessage: "done",
          createdAt: new Date(),
          question: {
            question: "What is JS?",
            topicId: "t1",
          },
          evaluation: {
            score: 8,
            mistakes: [{ content: "minor mistake" }],
            improvements: [{ content: "improve clarity" }],
          },
        },
      ]);

      const caller = createCaller();
      const result = await caller.getRecentAnswers();

      expect(result[0]).toMatchObject({
        id: "a1",
        question: "What is JS?",
        score: 8,
        mistakes: ["minor mistake"],
        improvements: ["improve clarity"],
      });
    });
  });

  describe("getQuestionSourceStats", () => {
    it("returns AI vs manual counts", async () => {
      (prisma.question.count as jest.Mock).mockResolvedValueOnce(3).mockResolvedValueOnce(7);

      const caller = createCaller();
      const result = await caller.getQuestionSourceStats();

      expect(result).toEqual({
        aiQuestions: 3,
        manualQuestions: 7,
      });
    });
  });

  describe("getAttemptTrends", () => {
    it("returns grouped attempts by date", async () => {
      const date = new Date();
      (prisma.answer.findMany as jest.Mock).mockResolvedValue([
        { createdAt: date },
        { createdAt: date },
      ]);

      const caller = createCaller();
      const result = await caller.getAttemptTrends();

      const key = date.toISOString().slice(0, 10);

      expect(result[key]).toBe(2);
    });
  });
});
