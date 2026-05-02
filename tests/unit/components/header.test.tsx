/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import ActionButton from "@/components/action-button";

type ActionResult = {
  error: boolean;
  message?: string;
};

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/components/loading-swap", () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));

describe("ActionButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls action on click", async () => {
    const actionMock = jest.fn<Promise<ActionResult>, []>().mockResolvedValue({ error: false });

    render(<ActionButton action={actionMock}>Click me</ActionButton>);

    fireEvent.click(screen.getByText("Click me"));

    await waitFor(() => {
      expect(actionMock).toHaveBeenCalled();
    });
  });

  it("shows success toast when action succeeds with message", async () => {
    const actionMock = jest.fn<Promise<ActionResult>, []>().mockResolvedValue({
      error: false,
      message: "Success!",
    });

    render(<ActionButton action={actionMock}>Submit</ActionButton>);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Success!");
    });
  });

  it("shows error toast when action fails", async () => {
    const actionMock = jest.fn<Promise<ActionResult>, []>().mockResolvedValue({
      error: true,
      message: "Something went wrong",
    });

    render(<ActionButton action={actionMock}>Submit</ActionButton>);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  it("disables button while loading", async () => {
    let resolveFn!: (value: ActionResult) => void;

    const actionMock = jest.fn<Promise<ActionResult>, []>(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve;
        }),
    );

    render(<ActionButton action={actionMock}>Submit</ActionButton>);

    const button = screen.getByText("Submit");

    fireEvent.click(button);

    resolveFn({ error: false });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("does not call action if dialog is cancelled", async () => {
    const actionMock = jest.fn<Promise<ActionResult>, []>();

    render(
      <ActionButton action={actionMock} requireAreYouSure>
        Delete
      </ActionButton>,
    );

    fireEvent.click(screen.getByText("Delete"));

    const cancelBtn = await screen.findByText("Cancel");
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(actionMock).not.toHaveBeenCalled();
    });
  });
});
