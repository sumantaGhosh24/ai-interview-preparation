/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useSuspenseQuestion } from "@/features/questions/hooks/use-questions";
import { useSubmitAnswer } from "@/features/answers/hooks/use-answers";
import AnswerEditor from "@/features/answers/components/answer-editor";

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useSuspenseQuestion: jest.fn(),
}));

jest.mock("@/hooks/use-answers", () => ({
  useSubmitAnswer: jest.fn(),
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

jest.mock("@monaco-editor/react", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

describe("AnswerEditor", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSuspenseQuestion as jest.Mock).mockReturnValue({
      data: { question: "Explain closures" },
    });

    (useSubmitAnswer as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
  });

  const setup = () => {
    render(<AnswerEditor questionId="q1" />);
  };

  it("renders question text", () => {
    setup();

    expect(screen.getByText("Explain closures")).toBeInTheDocument();
  });

  it("disables submit for short content", async () => {
    const user = userEvent.setup();
    setup();

    const editor = screen.getByTestId("editor");
    const button = screen.getByRole("button", { name: /submit answer/i });

    await user.type(editor, "short");

    expect(button).toBeDisabled();
  });

  it("enables submit for valid content", async () => {
    const user = userEvent.setup();
    setup();

    const editor = screen.getByTestId("editor");
    const button = screen.getByRole("button", { name: /submit answer/i });

    await user.type(editor, "this is valid content");

    expect(button).toBeEnabled();
  });

  it("submits trimmed content", async () => {
    const user = userEvent.setup();
    setup();

    const editor = screen.getByTestId("editor");
    const button = screen.getByRole("button", { name: /submit answer/i });

    await user.type(editor, "   valid content   ");

    await user.click(button);

    expect(mutate).toHaveBeenCalledWith(
      {
        questionId: "q1",
        content: "valid content",
      },
      expect.any(Object),
    );
  });

  it("clears content on success", async () => {
    const user = userEvent.setup();

    (useSubmitAnswer as jest.Mock).mockReturnValue({
      isPending: false,
      mutate: (_data: any, { onSuccess }: any) => {
        onSuccess();
      },
    });

    setup();

    const editor = screen.getByTestId("editor");

    await user.type(editor, "this is valid content");

    await user.click(screen.getByRole("button", { name: /submit answer/i }));

    expect(editor).toHaveValue("");
  });

  it("disables button while submitting", () => {
    (useSubmitAnswer as jest.Mock).mockReturnValue({
      mutate,
      isPending: true,
    });

    setup();

    expect(screen.getByRole("button", { name: /submit answer/i })).toBeDisabled();
  });
});
