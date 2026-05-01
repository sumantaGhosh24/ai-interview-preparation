/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseDashboard } from "@/features/analytics/hooks/use-analytics";
import DashboardData from "@/features/analytics/components/dashboard-data";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseDashboard: jest.fn(),
}));

describe("DashboardData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (data: any) => {
    (useSuspenseDashboard as jest.Mock).mockReturnValue({
      data,
    });

    render(<DashboardData />);
  };

  const mockDashboard = {
    totalTopics: 5,
    totalQuestions: 20,
    totalAnswers: 50,
    totalAttempts: 60,
    averageScore: 7.456,
    averageAccuracy: 0.823,
    averageAttemptsPerTopic: 3.789,
    bestTopic: {
      topicId: "1",
      topicName: "arrays",
      accuracy: 0.9,
      avgScore: 8.5,
    },
    weakestTopic: {
      topicId: "2",
      topicName: "dp",
      accuracy: 0.4,
      avgScore: 4.2,
    },
  };

  it("renders base stats correctly", () => {
    setup(mockDashboard);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("formats average values correctly", () => {
    setup(mockDashboard);

    expect(screen.getByText("7.46")).toBeInTheDocument();
    expect(screen.getByText("82.3%")).toBeInTheDocument();
    expect(screen.getByText("3.79")).toBeInTheDocument();
  });

  it("renders best topic correctly", () => {
    setup(mockDashboard);

    expect(screen.getByText("Best Topic")).toBeInTheDocument();
    expect(screen.getByText("arrays")).toBeInTheDocument();
    expect(screen.getByText("90.0%")).toBeInTheDocument();
    expect(screen.getByText("8.50")).toBeInTheDocument();
  });

  it("renders weakest topic correctly", () => {
    setup(mockDashboard);

    expect(screen.getByText("Weakest Topic")).toBeInTheDocument();
    expect(screen.getByText("dp")).toBeInTheDocument();
    expect(screen.getByText("40.0%")).toBeInTheDocument();
    expect(screen.getByText("4.20")).toBeInTheDocument();
  });

  it("handles null topics gracefully", () => {
    setup({
      ...mockDashboard,
      bestTopic: null,
      weakestTopic: null,
    });

    expect(screen.getByText("Best Topic")).toBeInTheDocument();
    expect(screen.getByText("Weakest Topic")).toBeInTheDocument();

    expect(screen.getAllByText("N/A")).toHaveLength(2);
    expect(screen.getAllByText("--")).toHaveLength(4);
  });
});
