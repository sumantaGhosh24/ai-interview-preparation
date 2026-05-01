/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseWeakTopics } from "@/features/analytics/hooks/use-analytics";
import WeakTopics from "@/features/analytics/components/weak-topics";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseWeakTopics: jest.fn(),
}));

describe("WeakTopics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (data: any) => {
    (useSuspenseWeakTopics as jest.Mock).mockReturnValue({
      data,
    });

    render(<WeakTopics />);
  };

  it("shows empty state when no data", () => {
    setup([]);

    expect(screen.getByText(/no weak topics found/i)).toBeInTheDocument();
  });

  it("shows empty state when data is null", () => {
    setup(null);

    expect(screen.getByText(/no weak topics found/i)).toBeInTheDocument();
  });

  it("renders table with data", () => {
    setup([
      {
        topicId: "t1",
        topicName: "arrays",
        accuracy: 0.75,
        avgScore: 7.456,
        attemptCount: 4,
      },
    ]);

    expect(screen.getByText("Weakest Topics")).toBeInTheDocument();

    expect(screen.getByText(/arrays/i)).toBeInTheDocument();

    expect(screen.getByText("75.0%")).toBeInTheDocument();

    expect(screen.getByText("7.46")).toBeInTheDocument();

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders multiple rows", () => {
    setup([
      {
        topicId: "t1",
        topicName: "arrays",
        accuracy: 0.5,
        avgScore: 5,
        attemptCount: 2,
      },
      {
        topicId: "t2",
        topicName: "graphs",
        accuracy: 0.25,
        avgScore: 3.2,
        attemptCount: 5,
      },
    ]);

    expect(screen.getByText(/arrays/i)).toBeInTheDocument();
    expect(screen.getByText(/graphs/i)).toBeInTheDocument();
  });
});
