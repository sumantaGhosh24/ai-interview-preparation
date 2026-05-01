/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseRecentAnswers } from "@/features/analytics/hooks/use-analytics";
import RecentAnswers from "@/features/analytics/components/recent-answers";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseRecentAnswers: jest.fn(),
}));

describe("RecentAnswers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (data: any) => {
    (useSuspenseRecentAnswers as jest.Mock).mockReturnValue({
      data,
    });

    render(<RecentAnswers />);
  };

  it("renders header with count", () => {
    setup([{ id: "1" }, { id: "2" }]);

    expect(screen.getByText("Recent Answers")).toBeInTheDocument();
    expect(screen.getByText(/last 2 question attempts/i)).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
    setup([]);

    expect(screen.getByText(/no recent answers found/i)).toBeInTheDocument();
  });

  it("renders answer details", () => {
    setup([
      {
        id: "a1",
        status: "CORRECT",
        statusMessage: "Well done",
        createdAt: new Date().toISOString(),
        question: "What is JS?",
        content: "A programming language",
        score: 10,
        mistakes: [],
        improvements: [],
      },
    ]);

    expect(screen.getByText("CORRECT")).toBeInTheDocument();
    expect(screen.getByText("Well done")).toBeInTheDocument();

    expect(screen.getByText("What is JS?")).toBeInTheDocument();
    expect(screen.getByText("A programming language")).toBeInTheDocument();

    expect(screen.getByText(/score:/i)).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows '--' when score is null", () => {
    setup([
      {
        id: "a1",
        status: "PENDING",
        statusMessage: null,
        createdAt: new Date().toISOString(),
        question: "Q",
        content: "A",
        score: null,
        mistakes: [],
        improvements: [],
      },
    ]);

    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("renders mistakes list", () => {
    setup([
      {
        id: "a1",
        status: "INCORRECT",
        statusMessage: null,
        createdAt: new Date().toISOString(),
        question: "Q",
        content: "A",
        score: 2,
        mistakes: ["Wrong logic", "Missed edge case"],
        improvements: [],
      },
    ]);

    expect(screen.getByText(/mistakes/i)).toBeInTheDocument();
    expect(screen.getByText("Wrong logic")).toBeInTheDocument();
    expect(screen.getByText("Missed edge case")).toBeInTheDocument();
  });

  it("renders improvements list", () => {
    setup([
      {
        id: "a1",
        status: "PARTIAL",
        statusMessage: null,
        createdAt: new Date().toISOString(),
        question: "Q",
        content: "A",
        score: 5,
        mistakes: [],
        improvements: ["Optimize logic"],
      },
    ]);

    expect(screen.getByText(/improvements/i)).toBeInTheDocument();
    expect(screen.getByText("Optimize logic")).toBeInTheDocument();
  });

  it("renders multiple answers", () => {
    setup([
      {
        id: "a1",
        status: "CORRECT",
        statusMessage: null,
        createdAt: new Date().toISOString(),
        question: "Q1",
        content: "A1",
        score: 10,
        mistakes: [],
        improvements: [],
      },
      {
        id: "a2",
        status: "INCORRECT",
        statusMessage: null,
        createdAt: new Date().toISOString(),
        question: "Q2",
        content: "A2",
        score: 2,
        mistakes: [],
        improvements: [],
      },
    ]);

    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
  });
});
