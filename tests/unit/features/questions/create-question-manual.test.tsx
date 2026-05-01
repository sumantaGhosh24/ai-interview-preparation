import { render, screen, fireEvent } from "@testing-library/react";

import { useCreateQuestionManual } from "@/features/questions/hooks/use-questions";
import CreateManualQuestion from "@/features/questions/components/create-question-manual";

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useCreateQuestionManual: jest.fn(),
}));

const mockedUseCreateQuestionManual = useCreateQuestionManual as jest.Mock;

describe("CreateManualQuestion Component", () => {
  const mockMutate = jest.fn();
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseCreateQuestionManual.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should render form fields correctly", () => {
    render(<CreateManualQuestion topicId="topic_1" setOpen={mockSetOpen} />);

    expect(screen.getByText("Question")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your question")).toBeInTheDocument();

    expect(screen.getByText("Question Difficulty")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create question/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit form correctly", async () => {
    render(<CreateManualQuestion topicId="topic_1" setOpen={mockSetOpen} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your question"), {
      target: {
        value: "Explain React lifecycle methods",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create question/i,
      }),
    );
  });

  it("should disable submit button when loading", () => {
    mockedUseCreateQuestionManual.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<CreateManualQuestion topicId="topic_1" setOpen={mockSetOpen} />);

    expect(
      screen.getByRole("button", {
        name: /create question/i,
      }),
    ).toBeDisabled();
  });
});
