import prisma from "@/lib/db";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
  getWeakTopics: protectedProcedure.query(async ({ctx}) => {
    const performances = await prisma.topicPerformance.findMany({
      where: {userId: ctx.auth.user.id},
      include: {topic: true},
      orderBy: [{accuracy: "asc"}, {avgScore: "asc"}, {attemptCount: "asc"}],
      take: 5,
    });

    return performances.map((item) => ({
      topicId: item.topicId,
      topicName: item.topic.name,
      accuracy:
        typeof item.accuracy === "number"
          ? item.accuracy > 1
            ? item.accuracy / 100
            : item.accuracy
          : 0,
      avgScore: item.avgScore,
      attemptCount: item.attemptCount,
    }));
  }),
  getDashboard: protectedProcedure.query(async ({ctx}) => {
    const [
      {count: totalTopics},
      {count: totalQuestions},
      {count: totalAnswers},
      averagePerformance,
      bestTopicPerformance,
      worstTopicPerformance,
    ] = await Promise.all([
      prisma.topic
        .aggregate({
          _count: {id: true},
          where: {userId: ctx.auth.user.id},
        })
        .then((res) => ({count: res._count.id})),

      prisma.question
        .aggregate({
          _count: {id: true},
          where: {topic: {userId: ctx.auth.user.id}},
        })
        .then((res) => ({count: res._count.id})),

      prisma.answer
        .aggregate({
          _count: {id: true},
          where: {userId: ctx.auth.user.id},
        })
        .then((res) => ({count: res._count.id})),

      prisma.topicPerformance.aggregate({
        where: {userId: ctx.auth.user.id},
        _avg: {
          avgScore: true,
          accuracy: true,
          attemptCount: true,
        },
      }),

      prisma.topicPerformance.findFirst({
        where: {userId: ctx.auth.user.id},
        orderBy: [{accuracy: "desc"}, {avgScore: "desc"}],
        include: {topic: true},
      }),

      prisma.topicPerformance.findFirst({
        where: {userId: ctx.auth.user.id},
        orderBy: [{accuracy: "asc"}, {avgScore: "asc"}],
        include: {topic: true},
      }),
    ]);

    const totalAttempts = await prisma.topicPerformance.aggregate({
      where: {userId: ctx.auth.user.id},
      _sum: {attemptCount: true},
    });

    const averageAccuracyRaw = averagePerformance._avg.accuracy ?? 0;
    let averageAccuracy: number;

    if (averageAccuracyRaw > 1.0) {
      averageAccuracy = averageAccuracyRaw / 100;
    } else {
      averageAccuracy = averageAccuracyRaw;
    }
    return {
      totalTopics: totalTopics ?? 0,
      totalQuestions: totalQuestions ?? 0,
      totalAnswers: totalAnswers ?? 0,
      averageScore: averagePerformance._avg.avgScore ?? 0,
      averageAccuracy: averageAccuracy,
      averageAttemptsPerTopic: averagePerformance._avg.attemptCount ?? 0,
      totalAttempts: totalAttempts._sum.attemptCount ?? 0,
      bestTopic: bestTopicPerformance
        ? {
            topicId: bestTopicPerformance.topicId,
            topicName: bestTopicPerformance.topic?.name,
            accuracy:
              bestTopicPerformance.accuracy > 1
                ? bestTopicPerformance.accuracy / 100
                : bestTopicPerformance.accuracy,
            avgScore: bestTopicPerformance.avgScore,
          }
        : null,
      weakestTopic: worstTopicPerformance
        ? {
            topicId: worstTopicPerformance.topicId,
            topicName: worstTopicPerformance.topic?.name,
            accuracy:
              worstTopicPerformance.accuracy > 1
                ? worstTopicPerformance.accuracy / 100
                : worstTopicPerformance.accuracy,
            avgScore: worstTopicPerformance.avgScore,
          }
        : null,
    };
  }),
  getRecentAnswers: protectedProcedure.query(async ({ctx}) => {
    const answers = await prisma.answer.findMany({
      where: {userId: ctx.auth.user.id},
      orderBy: [{createdAt: "desc"}],
      take: 5,
      include: {
        question: {select: {question: true, topicId: true}},
        evaluation: {
          include: {
            mistakes: true,
            improvements: true,
          },
        },
      },
    });

    return answers.map((ans) => ({
      id: ans.id,
      question: ans.question.question,
      topicId: ans.question.topicId,
      content: ans.content,
      status: ans.status,
      statusMessage: ans.statusMessage,
      createdAt: ans.createdAt,
      score: ans.evaluation?.score ?? null,
      mistakes: ans.evaluation?.mistakes.map((m) => m.content) ?? [],
      improvements: ans.evaluation?.improvements.map((i) => i.content) ?? [],
    }));
  }),
  getQuestionSourceStats: protectedProcedure.query(async ({ctx}) => {
    const [aiCount, manualCount] = await Promise.all([
      prisma.question.count({
        where: {
          topic: {userId: ctx.auth.user.id},
          isAI: true,
        },
      }),
      prisma.question.count({
        where: {
          topic: {userId: ctx.auth.user.id},
          isAI: false,
        },
      }),
    ]);

    return {
      aiQuestions: aiCount,
      manualQuestions: manualCount,
    };
  }),
  getAttemptTrends: protectedProcedure.query(async ({ctx}) => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const answers = await prisma.answer.findMany({
      where: {
        userId: ctx.auth.user.id,
        createdAt: {gte: since},
      },
      orderBy: {createdAt: "asc"},
      select: {
        createdAt: true,
      },
    });

    const byDay: {[date: string]: number} = {};
    for (const ans of answers) {
      const d = ans.createdAt.toISOString().slice(0, 10);
      byDay[d] = (byDay[d] || 0) + 1;
    }

    return byDay;
  }),
});
