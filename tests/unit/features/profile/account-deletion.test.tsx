import { render, screen } from "@testing-library/react";

import AccountDeletion from "@/features/profile/components/account-deletion";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    deleteUser: jest.fn(),
  },
}));

jest.mock("@/features/auth/components/auth-action-button", () => {
  return function MockAuthActionButton({
    children,
    variant,
    requireAreYouSure,
    successMessage,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    requireAreYouSure?: boolean;
    successMessage?: string;
    className?: string;
  }) {
    return (
      <button
        data-variant={variant}
        data-confirm={String(requireAreYouSure)}
        data-success-message={successMessage}
        data-classname={className}
      >
        {children}
      </button>
    );
  };
});

describe("AccountDeletion Component", () => {
  it("should render delete account button", () => {
    render(<AccountDeletion />);

    expect(screen.getByText("Delete Account Permanently")).toBeInTheDocument();
  });

  it("should pass correct props to AuthActionButton", () => {
    render(<AccountDeletion />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "destructive");

    expect(button).toHaveAttribute("data-confirm", "true");

    expect(button).toHaveAttribute("data-classname", "w-full");

    expect(button).toHaveAttribute(
      "data-success-message",
      "Account deletion initiated. Please check your email to confirm.",
    );
  });
});
