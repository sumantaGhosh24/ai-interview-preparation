/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateQuestionDialog from "@/features/questions/components/create-question-dialog";

jest.mock("@/features/questions/components/create-question-manual", () => ({
  __esModule: true,
  default: ({ topicId }: any) => <div>Manual Question Form - {topicId}</div>,
}));

jest.mock("@/features/questions/components/create-question-ai", () => ({
  __esModule: true,
  default: ({ topicId }: any) => <div>AI Question Generator - {topicId}</div>,
}));

jest.mock("@/features/questions/components/question-generation-status", () => ({
  __esModule: true,
  default: ({ jobId }: any) => <div>Generation Status - {jobId}</div>,
}));

describe("CreateQuestionDialog Component", () => {
  it("should render trigger button", () => {
    render(<CreateQuestionDialog topicId="topic_1" />);

    expect(
      screen.getByRole("button", {
        name: /create questions/i,
      }),
    ).toBeInTheDocument();
  });

  it("should render tabs content when dialog opens", async () => {
    const user = userEvent.setup();
    render(<CreateQuestionDialog topicId="topic_1" />);

    const triggerButton = screen.getByRole("button", {
      name: /create questions/i,
    });
    await user.click(triggerButton);

    expect(screen.getByText("Manual Question")).toBeInTheDocument();

    expect(screen.getByText("AI Questions Generator")).toBeInTheDocument();
  });

  it("should not show generation status initially", () => {
    render(<CreateQuestionDialog topicId="topic_1" />);

    expect(screen.queryByText(/Generation Status/i)).not.toBeInTheDocument();
  });
});
