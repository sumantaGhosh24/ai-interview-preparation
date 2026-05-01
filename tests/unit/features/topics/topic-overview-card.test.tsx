import { render, screen } from "@testing-library/react";

import { useSuspenseTopic } from "@/features/topics/hooks/use-topics";
import TopicOverviewCard from "@/features/topics/components/topic-overview-card";

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useSuspenseTopic: jest.fn(),
}));

const mockedUseSuspenseTopic = useSuspenseTopic as jest.Mock;

describe("TopicOverviewCard Component", () => {
  it("should render topic overview stats correctly", () => {
    mockedUseSuspenseTopic.mockReturnValue({
      data: {
        name: "React",
        description: "Frontend library",
        totalQuestions: 10,
        performance: [
          {
            attemptCount: 5,
            avgScore: 8,
            accuracy: 80,
          },
          {
            attemptCount: 3,
            avgScore: 6,
            accuracy: 60,
          },
        ],
      },
    });

    render(<TopicOverviewCard topicId="topic_1" />);

    expect(screen.getByText("React")).toBeInTheDocument();

    expect(screen.getByText("Frontend library")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getByText("7.0")).toBeInTheDocument();

    expect(screen.getByText("70.0%")).toBeInTheDocument();

    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("should handle empty performance data", () => {
    mockedUseSuspenseTopic.mockReturnValue({
      data: {
        name: "DSA",
        description: "Problem solving",
        totalQuestions: 0,
        performance: [],
      },
    });

    render(<TopicOverviewCard topicId="topic_2" />);

    expect(screen.getByText("0.0")).toBeInTheDocument();

    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });
});
