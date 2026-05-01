import { render, screen } from "@testing-library/react";

import Features from "@/features/landing/components/features";

jest.mock("@/constants/landing", () => ({
  features: [
    {
      title: "AI Evaluation",
      description: "Get instant feedback on your answers",
    },
    {
      title: "Adaptive Learning",
      description: "Questions adjust based on your performance",
    },
  ],
}));

describe("Features Component", () => {
  it("should render section heading", () => {
    render(<Features />);

    expect(screen.getByText("Built for serious interview preparation")).toBeInTheDocument();
  });

  it("should render all feature titles", () => {
    render(<Features />);

    expect(screen.getByText("AI Evaluation")).toBeInTheDocument();

    expect(screen.getByText("Adaptive Learning")).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<Features />);

    expect(screen.getByText("Get instant feedback on your answers")).toBeInTheDocument();

    expect(screen.getByText("Questions adjust based on your performance")).toBeInTheDocument();
  });
});
