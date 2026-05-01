/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseQuestionSourceStats } from "@/features/analytics/hooks/use-analytics";
import QuestionSourceStats from "@/features/analytics/components/question-source-stats";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseQuestionSourceStats: jest.fn(),
}));

describe("QuestionSourceStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (data: any) => {
    (useSuspenseQuestionSourceStats as jest.Mock).mockReturnValue({
      data,
    });

    render(<QuestionSourceStats />);
  };

  it("renders fallback values when stats are null", () => {
    setup(null);

    expect(screen.getAllByText("0")).toHaveLength(3);
    expect(screen.getAllByText("(0%)")).toHaveLength(2);
    expect(screen.getByText(/total questions:/i)).toBeInTheDocument();
  });

  it("calculates percentages correctly", () => {
    setup({
      aiQuestions: 3,
      manualQuestions: 1,
    });

    expect(screen.getByText("(75%)")).toBeInTheDocument();

    expect(screen.getByText("(25%)")).toBeInTheDocument();
  });

  it("renders counts correctly", () => {
    setup({
      aiQuestions: 5,
      manualQuestions: 5,
    });

    expect(screen.getAllByText("5")).toHaveLength(2);
  });

  it("renders total correctly", () => {
    setup({
      aiQuestions: 2,
      manualQuestions: 3,
    });

    expect(screen.getByText(/total questions:/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("handles zero total safely", () => {
    setup({
      aiQuestions: 0,
      manualQuestions: 0,
    });

    expect(screen.getAllByText("(0%)")).toHaveLength(2);
  });
});
