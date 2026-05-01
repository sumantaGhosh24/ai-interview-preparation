/* eslint-disable @typescript-eslint/no-explicit-any */
import { analyticsRouter } from "@/features/analytics/server/routers";
import prisma from "@/lib/db";

jest.mock("@/lib/cache", () => ({
  getOrSetCache: jest.fn((_, fn) => fn()),
}));

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

const createCaller = () =>
  analyticsRouter.createCaller({
    auth: {
      user: { id: "user-1" },
    },
  } as any);

describe("analyticsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getWeakTopics → normalizes accuracy", async () => {
    (prisma.topicPerformance.findMany as jest.Mock).mockResolvedValue([
      {
        topicId: "1",
        accuracy: 80,
        avgScore: 5,
        attemptCount: 10,
        topic: { name: "arrays" },
      },
    ]);

    const caller = createCaller();
    const result = await caller.getWeakTopics();

    expect(result).toEqual([
      {
        topicId: "1",
        topicName: "arrays",
        accuracy: 0.8,
        avgScore: 5,
        attemptCount: 10,
      },
    ]);
  });

  it("getDashboard → returns aggregated stats", async () => {
    (prisma.topic.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 2 } });
    (prisma.question.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 5 } });
    (prisma.answer.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 10 } });

    (prisma.topicPerformance.aggregate as jest.Mock)
      .mockResolvedValueOnce({
        _avg: { avgScore: 7, accuracy: 80, attemptCount: 3 },
      })
      .mockResolvedValueOnce({
        _sum: { attemptCount: 20 },
      });

    (prisma.topicPerformance.findFirst as jest.Mock)
      .mockResolvedValueOnce({
        topicId: "1",
        accuracy: 90,
        avgScore: 8,
        topic: { name: "arrays" },
      })
      .mockResolvedValueOnce({
        topicId: "2",
        accuracy: 30,
        avgScore: 4,
        topic: { name: "dp" },
      });

    const caller = createCaller();
    const result = await caller.getDashboard();

    expect(result).toMatchObject({
      totalTopics: 2,
      totalQuestions: 5,
      totalAnswers: 10,
      averageScore: 7,
      averageAccuracy: 0.8,
      averageAttemptsPerTopic: 3,
      totalAttempts: 20,
      bestTopic: {
        topicName: "arrays",
        accuracy: 0.9,
      },
      weakestTopic: {
        topicName: "dp",
        accuracy: 0.3,
      },
    });
  });

  it("getDashboard → handles null topics", async () => {
    (prisma.topic.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 0 } });
    (prisma.question.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 0 } });
    (prisma.answer.aggregate as jest.Mock).mockResolvedValue({ _count: { id: 0 } });

    (prisma.topicPerformance.aggregate as jest.Mock)
      .mockResolvedValueOnce({
        _avg: { avgScore: null, accuracy: null, attemptCount: null },
      })
      .mockResolvedValueOnce({
        _sum: { attemptCount: null },
      });

    (prisma.topicPerformance.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const caller = createCaller();
    const result = await caller.getDashboard();

    expect(result.bestTopic).toBeNull();
    expect(result.weakestTopic).toBeNull();
    expect(result.averageAccuracy).toBe(0);
  });

  it("getRecentAnswers → maps data correctly", async () => {
    (prisma.answer.findMany as jest.Mock).mockResolvedValue([
      {
        id: "a1",
        content: "answer",
        status: "COMPLETED",
        statusMessage: null,
        createdAt: new Date("2025-01-01"),
        question: { question: "Q1", topicId: "t1" },
        evaluation: {
          score: 8,
          mistakes: [{ content: "mistake1" }],
          improvements: [{ content: "improve1" }],
        },
      },
    ]);

    const caller = createCaller();
    const result = await caller.getRecentAnswers();

    expect(result[0]).toEqual({
      id: "a1",
      question: "Q1",
      topicId: "t1",
      content: "answer",
      status: "COMPLETED",
      statusMessage: null,
      createdAt: new Date("2025-01-01"),
      score: 8,
      mistakes: ["mistake1"],
      improvements: ["improve1"],
    });
  });

  it("getQuestionSourceStats → returns counts", async () => {
    (prisma.question.count as jest.Mock).mockResolvedValueOnce(3).mockResolvedValueOnce(7);

    const caller = createCaller();
    const result = await caller.getQuestionSourceStats();

    expect(result).toEqual({
      aiQuestions: 3,
      manualQuestions: 7,
    });
  });

  it("getAttemptTrends → groups by date", async () => {
    (prisma.answer.findMany as jest.Mock).mockResolvedValue([
      { createdAt: new Date("2025-01-01") },
      { createdAt: new Date("2025-01-01") },
      { createdAt: new Date("2025-01-02") },
    ]);

    const caller = createCaller();
    const result = await caller.getAttemptTrends();

    expect(result).toEqual({
      "2025-01-01": 2,
      "2025-01-02": 1,
    });
  });
});
