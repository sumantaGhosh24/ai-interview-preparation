/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import ForgotPassword from "@/features/auth/components/forgot-password";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("ForgotPassword", () => {
  const openSignInTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    render(<ForgotPassword openSignInTab={openSignInTab} />);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });
    const backButton = screen.getByRole("button", { name: /back/i });

    return { emailInput, submitButton, backButton };
  };

  it("renders form elements", () => {
    setup();

    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset email/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("calls openSignInTab when clicking back", async () => {
    const user = userEvent.setup();
    const { backButton } = setup();

    await user.click(backButton);

    expect(openSignInTab).toHaveBeenCalledTimes(1);
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    const { submitButton } = setup();

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter email")).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("submits valid email and calls API", async () => {
    const user = userEvent.setup();

    (authClient.requestPasswordReset as jest.Mock).mockImplementation(
      async (_data, { onSuccess }) => onSuccess(),
    );

    const { emailInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalledWith(
        {
          email: "john@example.com",
          redirectTo: "/reset-password",
        },
        expect.any(Object),
      );
    });
  });

  it("shows success toast on success", async () => {
    const user = userEvent.setup();

    (authClient.requestPasswordReset as jest.Mock).mockImplementation(
      async (_data, { onSuccess }) => onSuccess(),
    );

    const { emailInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Password reset email sent");
    });
  });

  it("shows error toast on failure", async () => {
    const user = userEvent.setup();

    (authClient.requestPasswordReset as jest.Mock).mockImplementation(async (_data, { onError }) =>
      onError({
        error: { message: "Failed request" },
      }),
    );

    const { emailInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed request");
    });
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    let resolvePromise: any;

    (authClient.requestPasswordReset as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { emailInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
