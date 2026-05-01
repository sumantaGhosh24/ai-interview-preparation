import { render, screen } from "@testing-library/react";

import WhyChooseUs from "@/features/landing/components/why-choose-us";

jest.mock("@/constants/landing", () => ({
  points: [
    "AI-powered feedback after every answer",
    "Track weak areas and improvement trends",
    "Personalized adaptive learning paths",
    "Mock interview mode with real-time practice",
  ],
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

describe("WhyChooseUs Component", () => {
  it("should render section heading", () => {
    render(<WhyChooseUs />);

    expect(screen.getByText("Why This Platform")).toBeInTheDocument();

    expect(
      screen.getByText("Built like a real learning system, not just another practice app"),
    ).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<WhyChooseUs />);

    expect(screen.getByText(/Instead of random question lists/)).toBeInTheDocument();
  });

  it("should render all platform points", () => {
    render(<WhyChooseUs />);

    expect(screen.getByText("AI-powered feedback after every answer")).toBeInTheDocument();

    expect(screen.getByText("Track weak areas and improvement trends")).toBeInTheDocument();

    expect(screen.getByText("Personalized adaptive learning paths")).toBeInTheDocument();

    expect(screen.getByText("Mock interview mode with real-time practice")).toBeInTheDocument();
  });
});
