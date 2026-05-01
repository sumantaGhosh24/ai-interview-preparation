import { render, screen } from "@testing-library/react";

import LearningPathsContainer from "@/features/learning-path/components/learning-paths-container";

jest.mock("@/features/learning-path/components/learning-paths-header", () => {
  return function MockLearningPathsHeader() {
    return <div>Mock Header</div>;
  };
});

jest.mock("@/features/learning-path/components/learning-paths-pagination", () => {
  return function MockLearningPathsPagination() {
    return <div>Mock Pagination</div>;
  };
});

jest.mock("@/components/entity-components", () => ({
  EntityContainer: ({
    header,
    pagination,
    children,
  }: {
    header: React.ReactNode;
    pagination: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div>
      <div>{header}</div>
      <div>{children}</div>
      <div>{pagination}</div>
    </div>
  ),
}));

describe("LearningPathsContainer Component", () => {
  it("should render header, children, and pagination", () => {
    render(
      <LearningPathsContainer>
        <div>Test Content</div>
      </LearningPathsContainer>,
    );

    expect(screen.getByText("Mock Header")).toBeInTheDocument();

    expect(screen.getByText("Test Content")).toBeInTheDocument();

    expect(screen.getByText("Mock Pagination")).toBeInTheDocument();
  });
});
