import { render, screen } from "@testing-library/react";

import { useGenerateAdaptiveQuestion } from "@/features/questions/hooks/use-questions";
import CreateQuestionAI from "@/features/questions/components/create-question-ai";

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useGenerateAdaptiveQuestion: jest.fn(),
}));

const mockedUseGenerateAdaptiveQuestion = useGenerateAdaptiveQuestion as jest.Mock;

describe("CreateQuestionAI Component", () => {
  const mockMutate = jest.fn();
  const mockSetJobId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseGenerateAdaptiveQuestion.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should render form correctly", () => {
    render(<CreateQuestionAI topicId="topic_1" setJobId={mockSetJobId} />);

    expect(screen.getByText("Number of Questions")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /generate ai questions/i,
      }),
    ).toBeInTheDocument();
  });

  it("should disable submit button when loading", () => {
    mockedUseGenerateAdaptiveQuestion.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<CreateQuestionAI topicId="topic_1" setJobId={mockSetJobId} />);

    expect(
      screen.getByRole("button", {
        name: /generate ai questions/i,
      }),
    ).toBeDisabled();
  });
});
