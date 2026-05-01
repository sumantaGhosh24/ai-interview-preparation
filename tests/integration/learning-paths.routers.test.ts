/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";

import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getPreviousWeaknesses } from "@/features/global/helpers/utils";
import { learningPathsRouter } from "@/features/learning-path/server/routers";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    topic: {
      findUnique: jest.fn(),
    },
    learningPath: {
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("@/inngest/client", () => ({
  inngest: {
    send: jest.fn(),
  },
}));

jest.mock("@/features/global/helpers/utils", () => ({
  getPreviousWeaknesses: jest.fn(),
}));

const createCaller = () => {
  return learningPathsRouter.createCaller({
    auth: {
      user: { id: "user-1" },
    },
  } as any);
};

describe("learningPathsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates learning path trigger", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue({
        id: "t1",
        name: "Arrays",
      });

      (getPreviousWeaknesses as jest.Mock).mockResolvedValue(["loops"]);

      const caller = createCaller();

      const result = await caller.create({ topicId: "t1" });

      expect(result).toEqual({ topicId: "t1" });

      expect(inngest.send).toHaveBeenCalledWith({
        name: "learning-path/generate",
        data: {
          userId: "user-1",
          topicId: "t1",
          topicName: "Arrays",
          previousWeaknesses: ["loops"],
        },
      });
    });

    it("throws if topic not found", async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      await expect(caller.create({ topicId: "invalid" })).rejects.toThrow(TRPCError);
    });
  });

  describe("remove", () => {
    it("deletes learning path", async () => {
      (prisma.learningPath.delete as jest.Mock).mockResolvedValue({
        id: "lp1",
      });

      const caller = createCaller();

      const result = await caller.remove({ id: "lp1" });

      expect(prisma.learningPath.delete).toHaveBeenCalledWith({
        where: { id: "lp1", userId: "user-1" },
      });

      expect(result).toEqual({ id: "lp1" });
    });
  });

  describe("getByTopicId", () => {
    it("returns learning path", async () => {
      (prisma.learningPath.findFirst as jest.Mock).mockResolvedValue({
        id: "lp1",
        topicId: "t1",
        phases: [],
        topic: { name: "Arrays" },
      });

      const caller = createCaller();

      const result = await caller.getByTopicId({ topicId: "t1" });

      expect(result?.id).toBe("lp1");
    });

    it("returns null if not found", async () => {
      (prisma.learningPath.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = createCaller();

      const result = await caller.getByTopicId({ topicId: "t1" });

      expect(result).toBeNull();
    });
  });

  describe("getMany", () => {
    it("returns paginated learning paths", async () => {
      (prisma.learningPath.findMany as jest.Mock).mockResolvedValue([{ id: "lp1" }, { id: "lp2" }]);

      (prisma.learningPath.count as jest.Mock).mockResolvedValue(2);

      const caller = createCaller();

      const result = await caller.getMany({
        page: 1,
        pageSize: 10,
      });

      expect(result.items.length).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });
});
