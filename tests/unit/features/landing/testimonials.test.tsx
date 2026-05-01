import { render, screen } from "@testing-library/react";

import Testimonials from "@/features/landing/components/testimonials";

jest.mock("@/constants/landing", () => ({
  testimonials: [
    {
      name: "Aman Sharma",
      feedback: "The AI feedback helped me improve my React answers a lot.",
    },
    {
      name: "Priya Das",
      feedback: "Mock interviews made me feel much more confident.",
    },
    {
      name: "Rohit Sen",
      feedback: "Tracking weak areas helped me focus on system design.",
    },
  ],
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,

  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("Testimonials Component", () => {
  it("should render section heading", () => {
    render(<Testimonials />);

    expect(screen.getByText("Success Stories")).toBeInTheDocument();

    expect(
      screen.getByText("Trusted by learners preparing for real interviews"),
    ).toBeInTheDocument();
  });

  it("should render all testimonials", () => {
    render(<Testimonials />);

    expect(
      screen.getByText(/The AI feedback helped me improve my React answers a lot./),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Mock interviews made me feel much more confident./),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Tracking weak areas helped me focus on system design./),
    ).toBeInTheDocument();
  });

  it("should render testimonial names", () => {
    render(<Testimonials />);

    expect(screen.getByText("Aman Sharma")).toBeInTheDocument();

    expect(screen.getByText("Priya Das")).toBeInTheDocument();

    expect(screen.getByText("Rohit Sen")).toBeInTheDocument();
  });
});
