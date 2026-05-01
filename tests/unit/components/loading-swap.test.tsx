import { render, screen } from "@testing-library/react";

import LoadingSwap from "@/components/loading-swap";

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

describe("LoadingSwap", () => {
  it("shows children and hides spinner when not loading", () => {
    render(
      <LoadingSwap isLoading={false}>
        <span>Content</span>
      </LoadingSwap>,
    );

    const content = screen.getByText("Content");
    const spinner = screen.getByTestId("spinner");
    const contentWrapper = content.parentElement;
    const spinnerWrapper = spinner.parentElement;

    expect(contentWrapper).toHaveClass("visible");
    expect(spinnerWrapper).toHaveClass("invisible");
  });

  it("shows spinner and hides children when loading", () => {
    render(
      <LoadingSwap isLoading={true}>
        <span>Content</span>
      </LoadingSwap>,
    );

    const content = screen.getByText("Content");
    const spinner = screen.getByTestId("spinner");
    const contentWrapper = content.parentElement;
    const spinnerWrapper = spinner.parentElement;

    expect(contentWrapper).toHaveClass("invisible");
    expect(spinnerWrapper).toHaveClass("visible");
  });

  it("keeps both elements in DOM (only toggles visibility)", () => {
    render(
      <LoadingSwap isLoading={true}>
        <span>Content</span>
      </LoadingSwap>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    render(
      <LoadingSwap isLoading={false} className="custom-class">
        <span>Content</span>
      </LoadingSwap>,
    );

    const contentWrapper = screen.getByText("Content").parentElement;
    const spinnerWrapper = screen.getByTestId("spinner").parentElement;

    expect(contentWrapper).toHaveClass("custom-class");
    expect(spinnerWrapper).toHaveClass("custom-class");
  });
});
