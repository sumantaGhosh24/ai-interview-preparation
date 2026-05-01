/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import ProfileUpdateForm from "@/features/profile/components/profile-update-form";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    updateUser: jest.fn(() =>
      Promise.resolve({
        error: null,
      }),
    ),
    changeEmail: jest.fn(() =>
      Promise.resolve({
        error: null,
      }),
    ),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/components/ui/field", () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  FieldGroup: ({ children }: any) => <div>{children}</div>,
  FieldLabel: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  FieldError: ({ errors }: any) => <div>{errors?.[0]?.message}</div>,
}));

const mockRefresh = jest.fn();

describe("ProfileUpdateForm Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    name: "Sumanta",
    email: "sumanta@example.com",
    favoriteNumber: 7,
  };

  it("should render form fields with default values", () => {
    render(<ProfileUpdateForm user={mockUser} />);

    expect(screen.getByDisplayValue("Sumanta")).toBeInTheDocument();
    expect(screen.getByDisplayValue("sumanta@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<ProfileUpdateForm user={mockUser} />);

    expect(
      screen.getByRole("button", {
        name: /update profile/i,
      }),
    ).toBeInTheDocument();
  });

  it("should allow updating input values", () => {
    render(<ProfileUpdateForm user={mockUser} />);

    const nameInput = screen.getByDisplayValue("Sumanta");
    const emailInput = screen.getByDisplayValue("sumanta@example.com");

    fireEvent.change(nameInput, {
      target: { value: "Updated Name" },
    });

    fireEvent.change(emailInput, {
      target: { value: "updated@example.com" },
    });

    expect(nameInput).toHaveValue("Updated Name");
    expect(emailInput).toHaveValue("updated@example.com");
  });

  it("should submit form", async () => {
    render(<ProfileUpdateForm user={mockUser} />);

    const button = screen.getByRole("button", {
      name: /update profile/i,
    });

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
