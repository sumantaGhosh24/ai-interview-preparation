/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";

import { authClient } from "@/lib/auth-client";
import TwoFactorAuth from "@/features/profile/components/two-factor-auth";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    twoFactor: {
      enable: jest.fn(),
      disable: jest.fn(),
      verifyTotp: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("react-qr-code", () => ({
  __esModule: true,
  default: () => <div>QR Code</div>,
}));

const mockedAuthClient = authClient as any;

describe("TwoFactorAuth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render enable 2FA form", () => {
    render(<TwoFactorAuth isEnabled={false} />);

    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /enable 2fa/i,
      }),
    ).toBeInTheDocument();
  });

  it("should render disable 2FA form when enabled", () => {
    render(<TwoFactorAuth isEnabled />);

    expect(
      screen.getByRole("button", {
        name: /disable 2fa/i,
      }),
    ).toBeInTheDocument();
  });

  it("should call enable 2FA submit", async () => {
    mockedAuthClient.twoFactor.enable.mockResolvedValue({
      data: {
        totpURI: "otpauth://test",
        backupCodes: ["code1", "code2"],
      },
      error: null,
    });

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: {
        value: "mypassword",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /enable 2fa/i,
      }),
    );
  });

  it("should render QR verification screen after enabling", async () => {
    mockedAuthClient.twoFactor.enable.mockResolvedValue({
      data: {
        totpURI: "otpauth://test",
        backupCodes: ["backup1", "backup2"],
      },
      error: null,
    });

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: {
        value: "mypassword",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /enable 2fa/i,
      }),
    );

    expect(await screen.findByText(/scan this qr code/i)).toBeInTheDocument();

    expect(screen.getByText("QR Code")).toBeInTheDocument();
  });
});
