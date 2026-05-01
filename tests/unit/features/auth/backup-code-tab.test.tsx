/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import BackupCodeTab from "@/features/auth/components/backup-code-tab";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    twoFactor: {
      verifyBackupCode: jest.fn(),
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

describe("BackupCodeTab", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  const setup = () => {
    render(<BackupCodeTab />);

    const input = screen.getByPlaceholderText("Enter backup code");
    const button = screen.getByRole("button", { name: /verify/i });

    return { input, button };
  };

  it("renders form elements", () => {
    setup();

    expect(screen.getByPlaceholderText("Enter backup code")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    const { button, input } = setup();

    await user.click(button);

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("submits valid code and redirects on success", async () => {
    const user = userEvent.setup();

    (authClient.twoFactor.verifyBackupCode as jest.Mock).mockImplementation(
      async (_data, { onSuccess }) => onSuccess(),
    );

    const { input, button } = setup();

    await user.type(input, "backup-123");
    await user.click(button);

    await waitFor(() => {
      expect(authClient.twoFactor.verifyBackupCode).toHaveBeenCalledWith(
        { code: "backup-123" },
        expect.any(Object),
      );

      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows toast on error", async () => {
    const user = userEvent.setup();

    (authClient.twoFactor.verifyBackupCode as jest.Mock).mockImplementation(
      async (_data, { onError }) =>
        onError({
          error: { message: "Invalid backup code" },
        }),
    );

    const { input, button } = setup();

    await user.type(input, "wrong-code");
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid backup code");
    });
  });

  it("disables button while submitting", async () => {
    const user = userEvent.setup();
    let resolvePromise: any;

    (authClient.twoFactor.verifyBackupCode as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { input, button } = setup();

    await user.type(input, "backup-123");
    await user.click(button);

    expect(button).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
