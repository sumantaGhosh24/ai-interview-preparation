import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "@/features/landing/components/header";

jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@/constants/landing", () => ({
  headerLinks: [
    {
      name: "Features",
      href: "/features",
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "Testimonials",
      href: "/testimonials",
    },
  ],
}));

jest.mock("@/components/mode-toggle", () => {
  return function MockModeToggle() {
    return <div>Mode Toggle</div>;
  };
});

jest.mock("@/components/ui/navigation-menu", () => ({
  NavigationMenu: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,

  NavigationMenuList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  NavigationMenuLink: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  navigationMenuTriggerStyle: () => "",
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("Header Component", () => {
  it("should render brand title", () => {
    render(<Header />);

    expect(screen.getByText("AI Interview Preparation")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Header />);

    expect(screen.getByText("Features")).toBeInTheDocument();

    expect(screen.getByText("Pricing")).toBeInTheDocument();

    expect(screen.getByText("Testimonials")).toBeInTheDocument();
  });

  it("should render auth buttons", () => {
    render(<Header />);

    expect(screen.getByText("Login")).toBeInTheDocument();

    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("should render mode toggle", () => {
    render(<Header />);

    expect(screen.getByText("Mode Toggle")).toBeInTheDocument();
  });

  it("should toggle mobile menu button", async () => {
    render(<Header />);

    const buttons = screen.getAllByRole("button");

    const menuButton = buttons[0];

    await userEvent.click(menuButton);

    expect(menuButton).toBeInTheDocument();
  });
});
