/* eslint-disable @typescript-eslint/no-explicit-any */
import { topicsRouter } from "@/features/topics/server/routers";
import prisma from "@/lib/db";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    topic: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    answer: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/cache", () => ({
  getOrSetCache: jest.fn((_, fn) => fn()),
}));

jest.mock("@/lib/cache-invalidation", () => ({
  invalidateTopicCaches: jest.fn(),
}));

const createCaller = () =>
  topicsRouter.createCaller({
    auth: {
      user: { id: "user-1" },
    },
  } as any);

describe("topicsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a topic", async () => {
    (prisma.topic.create as jest.Mock).mockResolvedValue({
      id: "t1",
      name: "arrays",
      description: "desc",
    });

    const caller = createCaller();
    const res = await caller.create({
      name: "arrays",
      description: "desc",
    });

    expect(res.id).toBe("t1");
    expect(prisma.topic.create).toHaveBeenCalled();
  });

  it("updates a topic", async () => {
    (prisma.topic.update as jest.Mock).mockResolvedValue({
      id: "t1",
      name: "updated",
      description: "updated desc",
    });

    const caller = createCaller();
    const res = await caller.update({
      id: "t1",
      name: "updated",
      description: "updated desc",
    });

    expect(res.name).toBe("updated");
  });

  it("deletes a topic", async () => {
    (prisma.topic.delete as jest.Mock).mockResolvedValue({
      id: "t1",
    });

    const caller = createCaller();
    const res = await caller.remove({ id: "t1" });

    expect(res.id).toBe("t1");
  });

  it("returns paginated topics", async () => {
    (prisma.topic.findMany as jest.Mock).mockResolvedValue([{ id: "t1", name: "arrays" }]);

    (prisma.topic.count as jest.Mock).mockResolvedValue(1);

    const caller = createCaller();
    const res = await caller.getMany({
      page: 1,
      pageSize: 10,
      search: "",
    });

    expect(res.items.length).toBe(1);
    expect(res.totalCount).toBe(1);
  });

  it("returns single topic with details", async () => {
    (prisma.topic.findUniqueOrThrow as jest.Mock).mockResolvedValue({
      id: "t1",
      name: "arrays",
      questions: [{ id: "q1" }],
      performance: [],
    });

    (prisma.answer.findMany as jest.Mock).mockResolvedValue([]);

    const caller = createCaller();
    const res = await caller.getOne({ id: "t1" });

    expect(res.id).toBe("t1");
    expect(res.totalQuestions).toBe(1);
  });
});
