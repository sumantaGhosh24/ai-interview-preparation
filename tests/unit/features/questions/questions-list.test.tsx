/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseQuestionsByTopic } from "@/features/questions/hooks/use-questions";
import QuestionsList from "@/features/questions/components/questions-list";

jest.mock("@/features/topics/components/question-card", () => ({
  __esModule: true,
  default: ({ question }: any) => <div>{question.question}</div>,
}));

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useSuspenseQuestionsByTopic: jest.fn(),
}));

jest.mock("@/components/entity-components", () => ({
  EntityList: ({ items, renderItem, emptyView }: any) => (
    <div>{items.length > 0 ? items.map(renderItem) : emptyView}</div>
  ),

  EmptyView: ({ title, description }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

const mockedUseSuspenseQuestionsByTopic = useSuspenseQuestionsByTopic as jest.Mock;

describe("QuestionsList Component", () => {
  it("should render questions list", () => {
    mockedUseSuspenseQuestionsByTopic.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            question: "Explain useEffect",
          },
          {
            id: "2",
            question: "What is closure?",
          },
        ],
      },
    });

    render(<QuestionsList topicId="topic_1" />);

    expect(screen.getByText("Explain useEffect")).toBeInTheDocument();

    expect(screen.getByText("What is closure?")).toBeInTheDocument();
  });

  it("should show empty state when no questions exist", () => {
    mockedUseSuspenseQuestionsByTopic.mockReturnValue({
      data: {
        items: [],
      },
    });

    render(<QuestionsList topicId="topic_1" />);

    expect(screen.getByText("No Question Found")).toBeInTheDocument();

    expect(screen.getByText("Currently you don't have any questions")).toBeInTheDocument();
  });
});
