export const sanitizeAIInput = (input: string): string => {
  return input
    .replace(/<script._?>._?<\/script>/gi, "")
    .replace(/ignore previous instructions/gi, "")
    .replace(/system prompt/gi, "")
    .trim();
};

export const safeJson = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};
