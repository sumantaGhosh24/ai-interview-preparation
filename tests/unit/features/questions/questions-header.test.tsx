/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import QuestionsHeader from "@/features/questions/components/questions-header";

jest.mock("@/features/questions/components/create-question-dialog", () => ({
  __esModule: true,
  default: ({ topicId }: any) => <button>Create Question - {topicId}</button>,
}));

jest.mock("@/components/entity-components", () => ({
  EntityHeader: ({ title, description, create }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{create}</div>
    </div>
  ),
}));

describe("QuestionsHeader Component", () => {
  it("should render header content correctly", () => {
    render(<QuestionsHeader topicId="topic_1" />);

    expect(screen.getByText("Questions")).toBeInTheDocument();

    expect(screen.getByText("Create and manage your questions")).toBeInTheDocument();

    expect(screen.getByText("Create Question - topic_1")).toBeInTheDocument();
  });
});
