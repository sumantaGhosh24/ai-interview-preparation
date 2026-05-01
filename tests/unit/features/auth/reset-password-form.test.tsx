import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    resetPassword: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("ResetPasswordForm", () => {
  const pushMock = jest.fn();

  let resetPasswordMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    resetPasswordMock = authClient.resetPassword as unknown as jest.Mock;
  });

  const mockSearchParams = (params: Record<string, string | null>) => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => params[key] ?? null,
    });
  };

  it("shows invalid link UI when token is missing", () => {
    mockSearchParams({ token: null, error: null });

    render(<ResetPasswordForm />);

    expect(screen.getByText(/invalid reset link/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /back to login/i })).toBeInTheDocument();
  });

  it("shows invalid link UI when error exists", () => {
    mockSearchParams({ token: "abc", error: "some_error" });

    render(<ResetPasswordForm />);

    expect(screen.getByText(/invalid reset link/i)).toBeInTheDocument();
  });

  it("renders form when token is valid", () => {
    mockSearchParams({ token: "valid-token", error: null });

    render(<ResetPasswordForm />);

    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error for empty/invalid password", async () => {
    const user = userEvent.setup();
    mockSearchParams({ token: "valid-token", error: null });

    render(<ResetPasswordForm />);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter password")).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("submits valid password and calls API", async () => {
    const user = userEvent.setup();
    mockSearchParams({ token: "valid-token", error: null });

    resetPasswordMock.mockImplementation(async (_data, { onSuccess }) => {
      onSuccess();
    });

    render(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText("Enter password"), "newpassword123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith(
        {
          newPassword: "newpassword123",
          token: "valid-token",
        },
        expect.any(Object),
      );
    });
  });

  it("shows toast and redirects on success", async () => {
    const user = userEvent.setup();
    mockSearchParams({ token: "valid-token", error: null });

    resetPasswordMock.mockImplementation(async (_data, { onSuccess }) => {
      onSuccess();
    });

    render(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText("Enter password"), "newpassword123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Password reset successful",
        expect.objectContaining({
          description: "Redirection to login...",
        }),
      );
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("shows toast on error", async () => {
    const user = userEvent.setup();
    mockSearchParams({ token: "valid-token", error: null });

    resetPasswordMock.mockImplementation(async (_data, { onError }) => {
      onError({
        error: { message: "Reset failed" },
      });
    });

    render(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText("Enter password"), "newpassword123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Reset failed");
    });
  });

  it("disables button while submitting", async () => {
    const user = userEvent.setup();
    mockSearchParams({ token: "valid-token", error: null });

    let resolvePromise!: () => void;

    resetPasswordMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<ResetPasswordForm />);

    await user.type(screen.getByPlaceholderText("Enter password"), "newpassword123");

    const button = screen.getByRole("button", {
      name: /reset password/i,
    });

    await user.click(button);

    expect(button).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
