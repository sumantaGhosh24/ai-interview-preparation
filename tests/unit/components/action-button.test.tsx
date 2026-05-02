/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import ActionButton from "@/components/action-button";

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
  const mockSuccess = toast.success as jest.Mock;
  const mockError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls action on click", async () => {
    const action = jest.fn().mockResolvedValue({ error: false });

    render(<ActionButton action={action}>Click me</ActionButton>);

    fireEvent.click(screen.getByText("Click me"));

    await waitFor(() => {
      expect(action).toHaveBeenCalled();
    });
  });

  it("shows success toast when action succeeds with message", async () => {
    const action = jest.fn().mockResolvedValue({
      error: false,
      message: "Success!",
    });

    render(<ActionButton action={action}>Click</ActionButton>);

    fireEvent.click(screen.getByText("Click"));

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith("Success!");
    });
  });

  it("shows error toast when action fails", async () => {
    const action = jest.fn().mockResolvedValue({
      error: true,
      message: "Failed!",
    });

    render(<ActionButton action={action}>Click</ActionButton>);

    fireEvent.click(screen.getByText("Click"));

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith("Failed!");
    });
  });

  it("disables button while loading", async () => {
    let resolveFn!: (value: { error: boolean }) => void;

    const action = jest.fn(
      () =>
        new Promise<{ error: boolean }>((resolve) => {
          resolveFn = resolve;
        }),
    );

    render(<ActionButton action={action}>Click</ActionButton>);

    const btn = screen.getByText("Click");

    fireEvent.click(btn);

    expect(btn.closest("button")).toBeDisabled();

    resolveFn({ error: false });

    await waitFor(() => {
      expect(btn.closest("button")).not.toBeDisabled();
    });
  });

  it("opens confirmation dialog when required", async () => {
    const action = jest.fn().mockResolvedValue({ error: false });

    render(
      <ActionButton action={action} requireAreYouSure>
        Delete
      </ActionButton>,
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(await screen.findByText("Are you sure?")).toBeInTheDocument();
  });

  it("calls action only after confirming", async () => {
    const action = jest.fn().mockResolvedValue({ error: false });

    render(
      <ActionButton action={action} requireAreYouSure>
        Delete
      </ActionButton>,
    );

    fireEvent.click(screen.getByText("Delete"));
  });

  it("does NOT call action when cancelled", async () => {
    const action = jest.fn().mockResolvedValue({ error: false });

    render(
      <ActionButton action={action} requireAreYouSure>
        Delete
      </ActionButton>,
    );

    fireEvent.click(screen.getByText("Delete"));

    fireEvent.click(await screen.findByText("Cancel"));

    await waitFor(() => {
      expect(action).not.toHaveBeenCalled();
    });
  });
});
