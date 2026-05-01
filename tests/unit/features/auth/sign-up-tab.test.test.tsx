/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import SignUpTab from "@/features/auth/components/sign-up-tab";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("SignUpTab", () => {
  const openEmailVerificationTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function fillForm() {
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter favorite number"), {
      target: { value: "7" },
    });
  }

  it("renders all fields", () => {
    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter favorite number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty form", async () => {
    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("aria-invalid", "true");
      });
    });
  });

  it("shows validation error for invalid favorite number", async () => {
    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    fireEvent.change(screen.getByPlaceholderText("Enter favorite number"), {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/favorite number must be a number/i)).toBeInTheDocument();
    });
  });

  it("submits valid form and calls API with transformed data", async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({
      error: null,
      data: {
        user: { emailVerified: true },
      },
    });

    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          favoriteNumber: 7,
          callbackURL: "/dashboard",
        },
        expect.any(Object),
      );
    });
  });

  it("opens email verification tab when email is not verified", async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({
      error: null,
      data: {
        user: { emailVerified: false },
      },
    });

    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(openEmailVerificationTab).toHaveBeenCalledWith("john@example.com");
    });
  });

  it("does not open email verification tab if email is verified", async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({
      error: null,
      data: {
        user: { emailVerified: true },
      },
    });

    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(openEmailVerificationTab).not.toHaveBeenCalled();
    });
  });

  it("shows toast on API error", async () => {
    (authClient.signUp.email as jest.Mock).mockImplementation(async (_data, { onError }) => {
      onError({
        error: { message: "Signup failed" },
      });

      return { error: true };
    });

    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Signup failed");
    });
  });

  it("disables button while submitting", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let resolvePromise: any;

    (authClient.signUp.email as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<SignUpTab openEmailVerificationTab={openEmailVerificationTab} />);

    fillForm();

    const button = screen.getByRole("button", { name: /sign up/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
