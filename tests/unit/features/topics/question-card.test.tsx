/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import QuestionCard from "@/features/topics/components/question-card";

const mockMutate = jest.fn();

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useRemoveQuestion: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("QuestionCard Component", () => {
  const mockQuestion = {
    id: "question_1",
    topicId: "topic_1",
    question: "Explain React useEffect",
    difficulty: "MEDIUM",
    isAI: true,
  };

  it("should render question details correctly", () => {
    render(<QuestionCard question={mockQuestion as any} />);

    expect(screen.getByText("Explain React useEffect")).toBeInTheDocument();

    expect(screen.getByText("MEDIUM")).toBeInTheDocument();

    expect(screen.getByText("AI Generated")).toBeInTheDocument();
  });

  it("should render Manual badge when question is manual", () => {
    render(
      <QuestionCard
        question={
          {
            ...mockQuestion,
            isAI: false,
          } as any
        }
      />,
    );

    expect(screen.getByText("Manual")).toBeInTheDocument();
  });
});
