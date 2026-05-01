/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import SignInTab from "@/features/auth/components/sign-in-tab";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/passkey-button", () => ({
  __esModule: true,
  default: () => <div data-testid="passkey-button" />,
}));

describe("SignInTab", () => {
  const pushMock = jest.fn();
  const openEmailVerificationTab = jest.fn();
  const openForgotPassword = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  const setup = () => {
    render(
      <SignInTab
        openEmailVerificationTab={openEmailVerificationTab}
        openForgotPassword={openForgotPassword}
      />,
    );

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter current password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const forgotButton = screen.getByRole("button", {
      name: /forgot password/i,
    });

    return { emailInput, passwordInput, submitButton, forgotButton };
  };

  it("renders all elements", () => {
    setup();

    expect(screen.getByTestId("passkey-button")).toBeInTheDocument();
  });

  it("calls forgot password handler", async () => {
    const user = userEvent.setup();
    const { forgotButton } = setup();

    await user.click(forgotButton);

    expect(openForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    const { submitButton } = setup();

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter email")).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByPlaceholderText("Enter current password")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  it("submits valid form and redirects on success", async () => {
    const user = userEvent.setup();

    (authClient.signIn.email as jest.Mock).mockImplementation(async (_data, { onSuccess }) =>
      onSuccess(),
    );

    const { emailInput, passwordInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        {
          email: "john@example.com",
          password: "password123",
          callbackURL: "/dashboard",
        },
        expect.any(Object),
      );

      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles EMAIL_NOT_VERIFIED error correctly", async () => {
    const user = userEvent.setup();

    (authClient.signIn.email as jest.Mock).mockImplementation(async (_data, { onError }) =>
      onError({
        error: {
          code: "EMAIL_NOT_VERIFIED",
          message: "Email not verified",
        },
      }),
    );

    const { emailInput, passwordInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(openEmailVerificationTab).toHaveBeenCalledWith("john@example.com");
      expect(toast.error).toHaveBeenCalledWith("Email not verified");
    });
  });

  it("handles generic error", async () => {
    const user = userEvent.setup();

    (authClient.signIn.email as jest.Mock).mockImplementation(async (_data, { onError }) =>
      onError({
        error: {
          code: "INVALID",
          message: "Invalid credentials",
        },
      }),
    );

    const { emailInput, passwordInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(openEmailVerificationTab).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    let resolvePromise: any;

    (authClient.signIn.email as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { emailInput, passwordInput, submitButton } = setup();

    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
