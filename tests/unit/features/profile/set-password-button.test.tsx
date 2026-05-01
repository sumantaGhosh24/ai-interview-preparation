/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { authClient } from "@/lib/auth-client";
import SetPasswordButton from "@/features/profile/components/set-password-button";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: jest.fn(),
  },
}));

jest.mock("@/features/auth/components/auth-action-button", () => ({
  __esModule: true,
  default: ({ children, successMessage, variant, action }: any) => (
    <div>
      <button onClick={action}>{children}</button>
      <span>{successMessage}</span>
      <span>{variant}</span>
    </div>
  ),
}));

const mockedAuthClient = authClient as any;

describe("SetPasswordButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button text correctly", () => {
    render(<SetPasswordButton email="test@example.com" />);

    expect(
      screen.getByRole("button", {
        name: /send password reset email/i,
      }),
    ).toBeInTheDocument();
  });

  it("should pass correct success message", () => {
    render(<SetPasswordButton email="test@example.com" />);

    expect(screen.getByText("Password reset email sent")).toBeInTheDocument();
  });

  it("should call password reset action with correct payload", async () => {
    mockedAuthClient.requestPasswordReset.mockResolvedValue({});

    render(<SetPasswordButton email="test@example.com" />);

    screen
      .getByRole("button", {
        name: /send password reset email/i,
      })
      .click();

    expect(mockedAuthClient.requestPasswordReset).toHaveBeenCalledWith({
      email: "test@example.com",
      redirectTo: "/reset-password",
    });
  });
});
