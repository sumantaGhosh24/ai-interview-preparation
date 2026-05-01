/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import PasskeyButton from "@/features/auth/components/passkey-button";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      passkey: jest.fn(),
    },
    useSession: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/auth-action-button", () => ({
  __esModule: true,
  default: ({ children, action }: any) => <button onClick={action}>{children}</button>,
}));

describe("PasskeyButton", () => {
  const pushMock = jest.fn();
  const refetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (authClient.useSession as jest.Mock).mockReturnValue({
      refetch: refetchMock,
    });
  });

  it("renders button", () => {
    render(<PasskeyButton />);

    expect(screen.getByRole("button", { name: /use passkey/i })).toBeInTheDocument();
  });

  it("calls passkey sign-in automatically on mount with autofill", async () => {
    (authClient.signIn.passkey as jest.Mock).mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<PasskeyButton />);

    await waitFor(() => {
      expect(authClient.signIn.passkey).toHaveBeenCalledWith(
        { autoFill: true },
        expect.any(Object),
      );
    });

    expect(refetchMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("calls passkey sign-in on button click", async () => {
    const user = userEvent.setup();

    (authClient.signIn.passkey as jest.Mock).mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<PasskeyButton />);

    await user.click(screen.getByRole("button", { name: /use passkey/i }));

    await waitFor(() => {
      expect(authClient.signIn.passkey).toHaveBeenCalledWith(undefined, expect.any(Object));
    });

    expect(refetchMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect if onSuccess is not triggered", async () => {
    const user = userEvent.setup();

    (authClient.signIn.passkey as jest.Mock).mockImplementation(() => {});

    render(<PasskeyButton />);

    await user.click(screen.getByRole("button", { name: /use passkey/i }));

    await waitFor(() => {
      expect(authClient.signIn.passkey).toHaveBeenCalled();
    });

    expect(refetchMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
