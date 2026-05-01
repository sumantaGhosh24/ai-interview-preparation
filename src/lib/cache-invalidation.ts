import { deleteByPattern, deleteManyCache } from "./cache";
import { cacheKeys } from "./cache-keys";

export async function invalidateTopicCaches(userId: string, topicId?: string) {
  const keys = [
    cacheKeys.dashboard(userId),
    cacheKeys.weakTopics(userId),
    cacheKeys.questionSourceStats(userId),
    cacheKeys.attemptTrends(userId),
  ];

  if (topicId) {
    keys.push(cacheKeys.topicDetail(userId, topicId));
  }

  await deleteManyCache(keys);

  await deleteByPattern(`topics:list:${userId}:*`);
}

export async function invalidateQuestionCaches(
  userId: string,
  topicId: string,
  questionId?: string,
) {
  const keys = [
    cacheKeys.dashboard(userId),
    cacheKeys.weakTopics(userId),
    cacheKeys.questionSourceStats(userId),
    cacheKeys.topicDetail(userId, topicId),
  ];

  if (questionId) {
    keys.push(cacheKeys.questionDetail(questionId));
  }

  await deleteManyCache(keys);

  await deleteByPattern(`questions:list:${topicId}:*`);
}

export async function invalidateAnswerCaches(userId: string, topicId: string, questionId: string) {
  const keys = [
    cacheKeys.dashboard(userId),
    cacheKeys.weakTopics(userId),
    cacheKeys.attemptTrends(userId),
    cacheKeys.topicDetail(userId, topicId),
    cacheKeys.questionDetail(questionId),
  ];

  await deleteManyCache(keys);
}
