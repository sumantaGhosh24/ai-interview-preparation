import { render, screen } from "@testing-library/react";

import { DiscordIcon, GitHubIcon, GoogleIcon } from "@/features/auth/components/o-auth-icons";

describe("Icons", () => {
  it("renders GoogleIcon", () => {
    const { container } = render(<GoogleIcon data-testid="google-icon" />);
    const svg = screen.getByTestId("google-icon");

    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("renders DiscordIcon", () => {
    const { container } = render(<DiscordIcon data-testid="discord-icon" />);
    const svg = screen.getByTestId("discord-icon");

    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("renders GitHubIcon", () => {
    const { container } = render(<GitHubIcon data-testid="github-icon" />);
    const svg = screen.getByTestId("github-icon");

    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("forwards props to svg", () => {
    render(<GoogleIcon data-testid="icon" className="custom-class" aria-label="google" />);

    const svg = screen.getByTestId("icon");

    expect(svg).toHaveClass("custom-class");
    expect(svg).toHaveAttribute("aria-label", "google");
  });
});
