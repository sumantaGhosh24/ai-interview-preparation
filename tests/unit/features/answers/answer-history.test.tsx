/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseQuestion } from "@/features/questions/hooks/use-questions";
import { useSuspenseAnswersHistory } from "@/features/answers/hooks/use-answers";
import AnswerHistory from "@/features/answers/components/answer-history";

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useSuspenseQuestion: jest.fn(),
}));

jest.mock("@/hooks/use-answers", () => ({
  useSuspenseAnswersHistory: jest.fn(),
}));

jest.mock("@/components/evaluation-card", () => ({
  __esModule: true,
  default: () => <div>EvaluationCard</div>,
}));

jest.mock("@/components/evaluation-status", () => ({
  __esModule: true,
  default: () => <div>EvaluationStatus</div>,
}));

describe("AnswerHistory", () => {
  const mockQuestion = {
    question: "What is React?",
    difficulty: "MEDIUM",
    isAI: true,
  };

  const setup = (answers: any[]) => {
    (useSuspenseQuestion as jest.Mock).mockReturnValue({
      data: mockQuestion,
    });

    (useSuspenseAnswersHistory as jest.Mock).mockReturnValue({
      data: { items: answers },
    });

    render(<AnswerHistory questionId="q1" />);
  };

  it("renders question info", () => {
    setup([]);

    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/ai generated/i)).toBeInTheDocument();
  });

  it("shows empty state when no answers", () => {
    setup([]);

    expect(screen.getByText(/no answers yet/i)).toBeInTheDocument();
  });

  it("renders EvaluationStatus when latest answer has no evaluation", () => {
    setup([
      {
        id: "a1",
        content: "answer",
        createdAt: new Date().toISOString(),
        evaluation: null,
      },
    ]);

    expect(screen.getByText("EvaluationStatus")).toBeInTheDocument();
  });

  it("renders EvaluationCard when latest answer has evaluation", () => {
    setup([
      {
        id: "a1",
        content: "answer",
        createdAt: new Date().toISOString(),
        evaluation: { score: 7 },
      },
    ]);

    expect(screen.getByText("EvaluationCard")).toBeInTheDocument();
  });

  it("renders submission history list", () => {
    setup([
      {
        id: "a1",
        content: "Answer 1",
        createdAt: new Date().toISOString(),
        evaluation: { score: 8 },
      },
      {
        id: "a2",
        content: "Answer 2",
        createdAt: new Date().toISOString(),
        evaluation: null,
      },
    ]);

    expect(screen.getByText(/submission history/i)).toBeInTheDocument();

    expect(screen.getByText("Answer 1")).toBeInTheDocument();
    expect(screen.getByText("Answer 2")).toBeInTheDocument();
  });

  it("shows evaluated and pending badges", () => {
    setup([
      {
        id: "a1",
        content: "Answer 1",
        createdAt: new Date().toISOString(),
        evaluation: { score: 8 },
      },
      {
        id: "a2",
        content: "Answer 2",
        createdAt: new Date().toISOString(),
        evaluation: null,
      },
    ]);

    expect(screen.getByText(/evaluated/i)).toBeInTheDocument();
  });

  it("shows score or pending text", () => {
    setup([
      {
        id: "a1",
        content: "Answer 1",
        createdAt: new Date().toISOString(),
        evaluation: { score: 9 },
      },
      {
        id: "a2",
        content: "Answer 2",
        createdAt: new Date().toISOString(),
        evaluation: null,
      },
    ]);

    expect(screen.getByText(/score: 9\/10/i)).toBeInTheDocument();
    expect(screen.getByText(/score: pending/i)).toBeInTheDocument();
  });
});
