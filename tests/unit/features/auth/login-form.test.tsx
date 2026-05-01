/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import LoginForm from "@/features/auth/components/login-form";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/sign-in-tab", () => ({
  __esModule: true,
  default: ({ openEmailVerificationTab, openForgotPassword }: any) => (
    <div>
      <button onClick={() => openEmailVerificationTab("test@example.com")}>
        trigger-email-verification
      </button>
      <button onClick={openForgotPassword}>trigger-forgot-password</button>
    </div>
  ),
}));

jest.mock("@/components/sign-up-tab", () => ({
  __esModule: true,
  default: ({ openEmailVerificationTab }: any) => (
    <button onClick={() => openEmailVerificationTab("signup@example.com")}>
      signup-email-verification
    </button>
  ),
}));

jest.mock("@/components/email-verification", () => ({
  __esModule: true,
  default: ({ email }: any) => <div>EmailVerification: {email}</div>,
}));

jest.mock("@/components/forgot-password", () => ({
  __esModule: true,
  default: ({ openSignInTab }: any) => <button onClick={openSignInTab}>back-to-signin</button>,
}));

jest.mock("@/components/social-auth-buttons", () => ({
  __esModule: true,
  default: () => <div>SocialButtons</div>,
}));

describe("LoginForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renders default sign-in tab", () => {
    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);
  });

  it("redirects if session exists", async () => {
    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: { user: {} },
    });

    render(<LoginForm />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("switches to signup tab", async () => {
    const user = userEvent.setup();

    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);

    await user.click(screen.getByRole("tab", { name: /sign up/i }));
  });

  it("opens email verification from sign-in", async () => {
    const user = userEvent.setup();

    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);

    await user.click(screen.getByText("trigger-email-verification"));

    await waitFor(() => {
      expect(screen.getByText(/emailverification: test@example.com/i)).toBeInTheDocument();
    });
  });

  it("opens email verification from sign-up", async () => {
    const user = userEvent.setup();

    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);

    await user.click(screen.getByRole("tab", { name: /sign up/i }));

    await user.click(screen.getByText("signup-email-verification"));

    await waitFor(() => {
      expect(screen.getByText(/emailverification: signup@example.com/i)).toBeInTheDocument();
    });
  });

  it("opens forgot password tab", async () => {
    const user = userEvent.setup();

    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);

    await user.click(screen.getByText("trigger-forgot-password"));

    await waitFor(() => {
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  it("returns to sign-in from forgot password", async () => {
    const user = userEvent.setup();

    (authClient.getSession as jest.Mock).mockResolvedValue({
      data: null,
    });

    render(<LoginForm />);

    await user.click(screen.getByText("trigger-forgot-password"));

    await user.click(screen.getByText("back-to-signin"));
  });
});
