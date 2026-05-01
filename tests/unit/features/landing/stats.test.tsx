import { render, screen } from "@testing-library/react";

import Stats from "@/features/landing/components/stats";

jest.mock("@/constants/landing", () => ({
  stats: [
    {
      value: "10K+",
      label: "Questions Practiced",
    },
    {
      value: "2K+",
      label: "Mock Interviews Completed",
    },
    {
      value: "95%",
      label: "User Satisfaction",
    },
    {
      value: "500+",
      label: "Learning Paths Created",
    },
  ],
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,

  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("Stats Component", () => {
  it("should render all stat values", () => {
    render(<Stats />);

    expect(screen.getByText("10K+")).toBeInTheDocument();

    expect(screen.getByText("2K+")).toBeInTheDocument();

    expect(screen.getByText("95%")).toBeInTheDocument();

    expect(screen.getByText("500+")).toBeInTheDocument();
  });

  it("should render all stat labels", () => {
    render(<Stats />);

    expect(screen.getByText("Questions Practiced")).toBeInTheDocument();

    expect(screen.getByText("Mock Interviews Completed")).toBeInTheDocument();

    expect(screen.getByText("User Satisfaction")).toBeInTheDocument();

    expect(screen.getByText("Learning Paths Created")).toBeInTheDocument();
  });
});
