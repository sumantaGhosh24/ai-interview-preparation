import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FAQ from "@/features/landing/components/faq";

jest.mock("@/constants/landing", () => ({
  faqs: [
    {
      q: "What is this platform?",
      a: "It is an AI-powered interview prep tool.",
    },
    {
      q: "Is it free?",
      a: "Yes, basic features are free to use.",
    },
  ],
}));

describe("FAQ Component", () => {
  it("should render section heading", () => {
    render(<FAQ />);

    expect(screen.getByText("Frequently asked questions")).toBeInTheDocument();
  });

  it("should render FAQ questions", () => {
    render(<FAQ />);

    expect(screen.getByText("What is this platform?")).toBeInTheDocument();
    expect(screen.getByText("Is it free?")).toBeInTheDocument();
  });

  it("should render FAQ answers", async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    expect(screen.getByText("It is an AI-powered interview prep tool.")).toBeInTheDocument();

    const secondTrigger = screen.getByText("Is it free?");
    await user.click(secondTrigger);

    expect(screen.getByText("Yes, basic features are free to use.")).toBeInTheDocument();
  });

  it("should render FAQ label", () => {
    render(<FAQ />);

    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });
});
