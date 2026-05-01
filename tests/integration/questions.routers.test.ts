/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";

import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { invalidateQuestionCaches } from "@/lib/cache-invalidation";
import { getPreviousWeaknesses, getRecommendedDifficulty } from "@/features/global/helpers/utils";
import { questionsRouter } from "@/features/questions/server/routers";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    topic: {
      findUnique: jest.fn(),
    },
    question: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    questionGenerationJob: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/inngest/client", () => ({
  inngest: {
    send: jest.fn(),
  },
}));

jest.mock("@/lib/cache-invalidation", () => ({
  invalidateQuestionCaches: jest.fn(),
}));

jest.mock("@/lib/cache", () => ({
  getOrSetCache: jest.fn((_, fn) => fn()),
}));

jest.mock("@/features/global/helpers/utils", () => ({
  getPreviousWeaknesses: jest.fn(),
  getRecommendedDifficulty: jest.fn(),
}));

const createCaller = () => {
  return questionsRouter.createCaller({
    auth: { user: { id: "user-1" } },
  } as any);
};

describe("questionsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createManual", () => {
    it("creates question", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({ id: "t1" });

      (prisma.question.create as jest.Mock).mockResolvedValue({
        id: "q1",
        question: "Test question",
      });

      const caller = createCaller();

      const result = await caller.createManual({
        topicId: "t1",
        question: "This is a valid question",
        difficulty: "EASY",
      });

      expect(result.id).toBe("q1");
      expect(invalidateQuestionCaches).toHaveBeenCalled();
    });

    it("throws if topic not found", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(
        caller.createManual({
          topicId: "bad",
          question: "This is a valid question",
          difficulty: "EASY",
        }),
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("generateAdaptive", () => {
    it("creates job and sends event", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({
        id: "t1",
        name: "Arrays",
      });

      (getRecommendedDifficulty as jest.Mock).mockResolvedValue("MEDIUM");
      (getPreviousWeaknesses as jest.Mock).mockResolvedValue(["loops"]);

      (prisma.questionGenerationJob.create as jest.Mock).mockResolvedValue({});

      const caller = createCaller();

      const result = await caller.generateAdaptive({
        topicId: "t1",
        numberOfQuestions: 2,
      });

      expect(result.topicId).toBe("t1");
      expect(result.jobId).toBeDefined();
      expect(inngest.send).toHaveBeenCalled();
    });

    it("throws if topic not found", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(caller.generateAdaptive({ topicId: "bad" })).rejects.toThrow(TRPCError);
    });
  });

  describe("getGenerationStatus", () => {
    it("returns job", async () => {
      (prisma.questionGenerationJob.findFirst as jest.Mock).mockResolvedValue({
        id: "job1",
      });

      const caller = createCaller();

      const result = await caller.getGenerationStatus({ jobId: "job1" });

      expect(result.id).toBe("job1");
    });

    it("throws if job not found", async () => {
      (prisma.questionGenerationJob.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(caller.getGenerationStatus({ jobId: "bad" })).rejects.toThrow(TRPCError);
    });
  });

  describe("remove", () => {
    it("deletes question", async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue({
        id: "q1",
        topicId: "t1",
      });

      (prisma.question.delete as jest.Mock).mockResolvedValue({
        id: "q1",
      });

      const caller = createCaller();

      const result = await caller.remove({ id: "q1" });

      expect(result.id).toBe("q1");
      expect(invalidateQuestionCaches).toHaveBeenCalled();
    });

    it("throws if question not found", async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(caller.remove({ id: "bad" })).rejects.toThrow(TRPCError);
    });
  });

  describe("getByTopic", () => {
    it("returns paginated questions", async () => {
      (prisma.question.findMany as jest.Mock).mockResolvedValue([{ id: "q1" }]);
      (prisma.question.count as jest.Mock).mockResolvedValue(1);

      const caller = createCaller();

      const result = await caller.getByTopic({
        topicId: "t1",
        page: 1,
        pageSize: 10,
        search: "",
      });

      expect(result.items.length).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("getOne", () => {
    it("returns question", async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue({
        id: "q1",
      });

      const caller = createCaller();

      const result = await caller.getOne({ id: "q1" });

      expect(result.id).toBe("q1");
    });

    it("throws if not found", async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(caller.getOne({ id: "bad" })).rejects.toThrow(TRPCError);
    });
  });
});
