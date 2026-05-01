/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";

import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/o-auth-providers";
import SocialAuthButtons from "@/features/auth/components/social-auth-buttons";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: jest.fn(),
    },
  },
}));

jest.mock("@/components/auth-action-button", () => ({
  __esModule: true,
  default: ({ children, action }: any) => <button onClick={action}>{children}</button>,
}));

jest.mock("@/lib/o-auth-providers", () => ({
  SUPPORTED_OAUTH_PROVIDERS: ["google", "github"],
  SUPPORTED_OAUTH_PROVIDER_DETAILS: {
    google: {
      name: "Google",
      Icon: () => <svg data-testid="google-icon" />,
    },
    github: {
      name: "GitHub",
      Icon: () => <svg data-testid="github-icon" />,
    },
  },
}));

describe("SocialAuthButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all providers", () => {
    render(<SocialAuthButtons />);

    SUPPORTED_OAUTH_PROVIDERS.forEach((provider) => {
      const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders icons for each provider", () => {
    render(<SocialAuthButtons />);

    expect(screen.getByTestId("google-icon")).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
  });

  it("calls authClient.signIn.social with correct provider on click", () => {
    render(<SocialAuthButtons />);

    SUPPORTED_OAUTH_PROVIDERS.forEach((provider) => {
      const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;

      fireEvent.click(screen.getByText(name));

      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider,
        callbackURL: "/dashboard",
      });
    });
  });

  it("calls authClient once per click", () => {
    render(<SocialAuthButtons />);

    fireEvent.click(screen.getByText("Google"));

    expect(authClient.signIn.social).toHaveBeenCalledTimes(1);
  });
});
