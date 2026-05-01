import React from "react";
import { render, screen } from "@testing-library/react";

import CTA from "@/features/landing/components/cta";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };

  MockLink.displayName = "MockNextLink";

  return MockLink;
});

describe("CTA Component", () => {
  it("should render main heading", () => {
    render(<CTA />);

    expect(screen.getByText("Ready to crack your next interview?")).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<CTA />);

    expect(screen.getByText(/Practice smarter, identify weaknesses faster/i)).toBeInTheDocument();
  });

  it("should render CTA button with correct text", () => {
    render(<CTA />);

    expect(screen.getByRole("link", { name: /Get Started Free/i })).toBeInTheDocument();
  });

  it("should link to login page", () => {
    render(<CTA />);

    const link = screen.getByRole("link", { name: /Get Started Free/i });

    expect(link).toHaveAttribute("href", "/login");
  });
});
