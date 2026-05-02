import { render, screen } from "@testing-library/react";

import Footer from "@/features/landing/components/footer";

describe("Footer", () => {
  it("should render main brand name", () => {
    render(<Footer />);

    expect(screen.getByText("AI Interview Preparation")).toBeInTheDocument();
  });

  it("should render platform section items", () => {
    render(<Footer />);

    expect(screen.getByText("AI Evaluation")).toBeInTheDocument();

    expect(screen.getByText("Adaptive Questions")).toBeInTheDocument();
  });

  it("should render resources section items", () => {
    render(<Footer />);

    expect(screen.getByText("Documentation")).toBeInTheDocument();

    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("should render contact details", () => {
    render(<Footer />);

    expect(screen.getByText("Sumanta Ghosh")).toBeInTheDocument();

    expect(screen.getByText("GitHub Profile")).toBeInTheDocument();

    expect(screen.getByText("LinkedIn Profile")).toBeInTheDocument();
  });

  it("should render copyright text", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 AI Interview Prep Platform/)).toBeInTheDocument();
  });
});
