import { render, screen } from "@testing-library/react";

import Hero from "@/features/landing/components/hero";

jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,

  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("Hero Component", () => {
  it("should render hero heading", () => {
    render(<Hero />);

    expect(screen.getByText("AI-Powered Interview Preparation Platform")).toBeInTheDocument();

    expect(screen.getByText(/Practice/)).toBeInTheDocument();

    expect(screen.getByText(/Interviews/)).toBeInTheDocument();

    expect(screen.getByText(/Real One/)).toBeInTheDocument();
  });

  it("should render CTA buttons", () => {
    render(<Hero />);

    expect(screen.getByText("Start Practicing")).toBeInTheDocument();

    expect(screen.getByText("View Demo")).toBeInTheDocument();
  });

  it("should render latest evaluation section", () => {
    render(<Hero />);

    expect(screen.getByText("Latest Evaluation")).toBeInTheDocument();

    expect(screen.getByText("Explain React useEffect cleanup function")).toBeInTheDocument();

    expect(screen.getByText("8.7 / 10")).toBeInTheDocument();

    expect(screen.getByText("Lifecycle")).toBeInTheDocument();
  });

  it("should render AI feedback text", () => {
    render(<Hero />);

    expect(screen.getByText(/Strong understanding of cleanup logic/)).toBeInTheDocument();
  });
});
