/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import QuestionsContainer from "@/features/questions/components/questions-container";

jest.mock("@/features/questions/components/questions-header", () => ({
  __esModule: true,
  default: ({ topicId }: any) => <div>Questions Header - {topicId}</div>,
}));

jest.mock("@/features/questions/components/questions-pagination", () => ({
  __esModule: true,
  default: ({ topicId }: any) => <div>Questions Pagination - {topicId}</div>,
}));

jest.mock("@/components/entity-components", () => ({
  EntityContainer: ({ header, search, pagination, children }: any) => (
    <div>
      <div>{header}</div>
      <div>{search}</div>
      <div>{pagination}</div>
      <div>{children}</div>
    </div>
  ),

  EntitySearch: ({ placeholder }: any) => <input placeholder={placeholder} readOnly />,
}));

describe("QuestionsContainer Component", () => {
  it("should render layout sections correctly", () => {
    render(
      <QuestionsContainer topicId="topic_1">
        <div>Questions Content</div>
      </QuestionsContainer>,
    );

    expect(screen.getByText("Questions Header - topic_1")).toBeInTheDocument();

    expect(screen.getByText("Questions Pagination - topic_1")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Search questions")).toBeInTheDocument();

    expect(screen.getByText("Questions Content")).toBeInTheDocument();
  });
});
