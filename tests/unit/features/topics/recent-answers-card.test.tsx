/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseTopic } from "@/features/topics/hooks/use-topics";
import RecentAnswersCard from "@/features/topics/components/recent-answers-card";

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useSuspenseTopic: jest.fn(),
}));

jest.mock("@/components/entity-components", () => ({
  EmptyView: ({ title, description }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 days ago",
}));

const mockedUseSuspenseTopic = useSuspenseTopic as jest.Mock;

describe("RecentAnswersCard Component", () => {
  it("should show empty state when no attempts exist", () => {
    mockedUseSuspenseTopic.mockReturnValue({
      data: {
        recentAnswers: [],
      },
    });

    render(<RecentAnswersCard topicId="topic_1" />);

    expect(screen.getByText("No attempts yet")).toBeInTheDocument();

    expect(
      screen.getByText("Start solving your first question to get started"),
    ).toBeInTheDocument();
  });

  it("should render recent answers correctly", () => {
    mockedUseSuspenseTopic.mockReturnValue({
      data: {
        recentAnswers: [
          {
            id: "1",
            content: "useEffect runs after render",
            createdAt: new Date(),
            question: {
              question: "Explain useEffect",
            },
            evaluation: {
              score: 8,
            },
          },
        ],
      },
    });

    render(<RecentAnswersCard topicId="topic_1" />);

    expect(screen.getByText("Explain useEffect")).toBeInTheDocument();
    expect(screen.getByText("useEffect runs after render")).toBeInTheDocument();
    expect(screen.getByText("Score: 8")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it("should show Pending when score is missing", () => {
    mockedUseSuspenseTopic.mockReturnValue({
      data: {
        recentAnswers: [
          {
            id: "2",
            content: "My answer",
            createdAt: new Date(),
            question: {
              question: "What is closure?",
            },
            evaluation: null,
          },
        ],
      },
    });

    render(<RecentAnswersCard topicId="topic_2" />);

    expect(screen.getByText("Score: Pending")).toBeInTheDocument();
  });
});
