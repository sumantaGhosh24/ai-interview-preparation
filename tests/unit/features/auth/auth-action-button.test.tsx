/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthActionButton from "@/features/auth/components/auth-action-button";

const actionMock = jest.fn();

jest.mock("@/components/action-button", () => ({
  __esModule: true,
  default: ({ children, action, ...props }: any) => {
    actionMock.mockImplementation(action);

    return (
      <button onClick={() => action()} {...props}>
        {children}
      </button>
    );
  },
}));

describe("AuthActionButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls wrapped action and returns success result", async () => {
    const user = userEvent.setup();

    const originalAction = jest.fn().mockResolvedValue({
      error: null,
    });

    render(
      <AuthActionButton action={originalAction} successMessage="Success!">
        Click
      </AuthActionButton>,
    );

    await user.click(screen.getByRole("button", { name: /click/i }));

    expect(originalAction).toHaveBeenCalled();

    const result = await actionMock();

    expect(result).toEqual({
      error: false,
      message: "Success!",
    });
  });

  it("returns error when action fails with message", async () => {
    const originalAction = jest.fn().mockResolvedValue({
      error: { message: "Failure" },
    });

    render(<AuthActionButton action={originalAction}>Click</AuthActionButton>);

    const result = await actionMock();

    expect(result).toEqual({
      error: true,
      message: "Failure",
    });
  });

  it("returns default error message if none provided", async () => {
    const originalAction = jest.fn().mockResolvedValue({
      error: {},
    });

    render(<AuthActionButton action={originalAction}>Click</AuthActionButton>);

    const result = await actionMock();

    expect(result).toEqual({
      error: true,
      message: "Action failed",
    });
  });

  it("passes props to ActionButton", () => {
    render(
      <AuthActionButton action={jest.fn()} className="test-class">
        Click
      </AuthActionButton>,
    );

    expect(screen.getByRole("button")).toHaveClass("test-class");
  });
});
