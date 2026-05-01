/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import SessionManagement from "@/features/profile/components/session-management";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("ua-parser-js", () => ({
  UAParser: jest.fn(() => ({
    browser: { name: "Chrome" },
    os: { name: "Windows" },
    device: { type: "desktop" },
  })),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    revokeOtherSessions: jest.fn(),
    revokeSession: jest.fn(),
  },
}));

jest.mock("@/features/auth/components/auth-action-button", () => ({
  __esModule: true,
  default: ({ children, action }: any) => <button onClick={action}>{children}</button>,
}));

const mockRefresh = jest.fn();

describe("SessionManagement Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const sessions = [
    {
      id: "1",
      token: "current-token",
      userAgent: "current-agent",
      createdAt: new Date("2024-01-01"),
      expiresAt: new Date("2024-02-01"),
    },
    {
      id: "2",
      token: "other-token",
      userAgent: "other-agent",
      createdAt: new Date("2024-01-05"),
      expiresAt: new Date("2024-02-05"),
    },
  ];

  it("should render current session badge", () => {
    render(<SessionManagement sessions={sessions as any} currentSessionToken="current-token" />);

    expect(screen.getByText("Current Session")).toBeInTheDocument();
  });

  it("should render revoke other sessions button when other sessions exist", () => {
    render(<SessionManagement sessions={sessions as any} currentSessionToken="current-token" />);

    expect(screen.getByText("Revoke Other Sessions")).toBeInTheDocument();
  });

  it("should show empty state when no other sessions exist", () => {
    render(
      <SessionManagement sessions={[sessions[0]] as any} currentSessionToken="current-token" />,
    );

    expect(screen.getByText("No other active sessions")).toBeInTheDocument();
  });

  it("should render browser information", () => {
    render(<SessionManagement sessions={sessions as any} currentSessionToken="current-token" />);

    expect(screen.getAllByText("Chrome, Windows")[0]).toBeInTheDocument();
  });
});
