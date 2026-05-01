import { render, screen } from "@testing-library/react";

import Workflow from "@/features/landing/components/workflow";

jest.mock("@/constants/landing", () => ({
  workflows: [
    "Add Topics",
    "Get AI Questions",
    "Submit Answers",
    "Receive Feedback",
    "Track Progress",
  ],
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,

  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("Workflow Component", () => {
  it("should render section heading", () => {
    render(<Workflow />);

    expect(screen.getByText("Workflow")).toBeInTheDocument();

    expect(screen.getByText("From practice to improvement")).toBeInTheDocument();
  });

  it("should render all workflow steps", () => {
    render(<Workflow />);

    expect(screen.getByText("Add Topics")).toBeInTheDocument();

    expect(screen.getByText("Get AI Questions")).toBeInTheDocument();

    expect(screen.getByText("Submit Answers")).toBeInTheDocument();

    expect(screen.getByText("Receive Feedback")).toBeInTheDocument();

    expect(screen.getByText("Track Progress")).toBeInTheDocument();
  });

  it("should render step labels", () => {
    render(<Workflow />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();

    expect(screen.getByText("Step 2")).toBeInTheDocument();

    expect(screen.getByText("Step 3")).toBeInTheDocument();

    expect(screen.getByText("Step 4")).toBeInTheDocument();

    expect(screen.getByText("Step 5")).toBeInTheDocument();
  });
});
