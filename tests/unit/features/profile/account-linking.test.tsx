/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import AccountLinking from "@/features/profile/components/account-linking";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    linkSocial: jest.fn(),
    unlinkAccount: jest.fn(),
  },
}));

jest.mock("@/lib/o-auth-providers", () => ({
  SUPPORTED_OAUTH_PROVIDERS: ["google", "github"],
  SUPPORTED_OAUTH_PROVIDER_DETAILS: {
    google: {
      name: "Google",
      Icon: () => <div>Google Icon</div>,
    },
    github: {
      name: "GitHub",
      Icon: () => <div>GitHub Icon</div>,
    },
  },
}));

jest.mock("@/features/auth/components/auth-action-button", () => {
  return function MockAuthActionButton({ children }: { children: React.ReactNode }) {
    return <button>{children}</button>;
  };
});

describe("AccountLinking Component", () => {
  it("should show empty state when no linked accounts exist", () => {
    render(<AccountLinking currentAccounts={[]} />);

    expect(screen.getByText("Linked Accounts")).toBeInTheDocument();

    expect(screen.getByText("No linked accounts found")).toBeInTheDocument();

    expect(screen.getByText("Link Other Accounts")).toBeInTheDocument();

    expect(screen.getByText("Google")).toBeInTheDocument();

    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("should render linked account correctly", () => {
    const mockAccounts = [
      {
        id: "1",
        accountId: "google-account-1",
        providerId: "google",
        createdAt: new Date("2026-01-10"),
      },
    ];

    render(<AccountLinking currentAccounts={mockAccounts as any} />);

    expect(screen.getByText("Google")).toBeInTheDocument();

    expect(screen.getByText(/Linked on/i)).toBeInTheDocument();

    expect(screen.getByText("Unlink")).toBeInTheDocument();
  });

  it("should show unlinked providers in link section", () => {
    const mockAccounts = [
      {
        id: "1",
        accountId: "google-account-1",
        providerId: "google",
        createdAt: new Date("2026-01-10"),
      },
    ];

    render(<AccountLinking currentAccounts={mockAccounts as any} />);

    expect(screen.getByText("GitHub")).toBeInTheDocument();

    expect(screen.getByText("Link")).toBeInTheDocument();
  });
});
