/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import PasskeyManagement from "@/features/profile/components/passkey-management";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    passkey: {
      addPasskey: jest.fn(),
      deletePasskey: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/features/auth/components/auth-action-button", () => ({
  __esModule: true,
  default: ({ children, action }: any) => <button onClick={action}>{children}</button>,
}));

const mockRefresh = jest.fn();

describe("PasskeyManagement Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPasskeys = [
    {
      id: "1",
      name: "MacBook Passkey",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "2",
      name: "iPhone Passkey",
      createdAt: new Date("2024-02-15"),
    },
  ];

  it("should render empty state when no passkeys exist", () => {
    render(<PasskeyManagement passkeys={[]} />);

    expect(screen.getByText("No passkeys yet")).toBeInTheDocument();

    expect(
      screen.getByText("Add your first passkey for secure, passwordless authentication."),
    ).toBeInTheDocument();
  });

  it("should render existing passkeys", () => {
    render(<PasskeyManagement passkeys={mockPasskeys as any} />);

    expect(screen.getByText("MacBook Passkey")).toBeInTheDocument();

    expect(screen.getByText("iPhone Passkey")).toBeInTheDocument();
  });

  it("should render new passkey button", () => {
    render(<PasskeyManagement passkeys={[]} />);

    expect(
      screen.getByRole("button", {
        name: /new passkey/i,
      }),
    ).toBeInTheDocument();
  });

  it("should open dialog when clicking new passkey button", () => {
    render(<PasskeyManagement passkeys={[]} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /new passkey/i,
      }),
    );

    expect(screen.getByText("Add New Passkey")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });
});
