export const cacheKeys = {
  dashboard: (userId: string) => `analytics:dashboard:${userId}`,

  weakTopics: (userId: string) => `analytics:weak-topics:${userId}`,

  questionSourceStats: (userId: string) =>
    `analytics:question-source-stats:${userId}`,

  attemptTrends: (userId: string) => `analytics:attempt-trends:${userId}`,

  topicsList: (
    userId: string,
    page: number,
    pageSize: number,
    search: string,
  ) => `topics:list:${userId}:${page}:${pageSize}:${search}`,

  topicDetail: (userId: string, topicId: string) =>
    `topic:detail:${userId}:${topicId}`,

  questionsList: (
    topicId: string,
    page: number,
    pageSize: number,
    search: string,
  ) => `questions:list:${topicId}:${page}:${pageSize}:${search}`,

  questionDetail: (questionId: string) => `question:detail:${questionId}`,
};
