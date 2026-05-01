/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import TotpForm from "@/features/auth/components/totp-form";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    twoFactor: {
      verifyTotp: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("TotpForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    jest.clearAllMocks();
  });

  it("renders input and button", () => {
    render(<TotpForm />);

    expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  it("shows validation error for invalid code", async () => {
    render(<TotpForm />);

    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("submits valid code and navigates on success", async () => {
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<TotpForm />);

    const input = screen.getByPlaceholderText("Enter code");
    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(authClient.twoFactor.verifyTotp).toHaveBeenCalledWith(
        { code: "123456" },
        expect.any(Object),
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows toast on error", async () => {
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation((_data, { onError }) => {
      onError({
        error: { message: "Invalid code" },
      });
    });

    render(<TotpForm />);

    const input = screen.getByPlaceholderText("Enter code");
    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid code");
    });
  });

  it("disables button while submitting", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let resolvePromise: any;

    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<TotpForm />);

    const input = screen.getByPlaceholderText("Enter code");
    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
