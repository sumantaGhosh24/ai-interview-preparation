import { render, screen } from "@testing-library/react";

import LearningPathsHeader from "@/features/learning-path/components/learning-paths-header";

jest.mock("@/components/entity-components", () => ({
  EntityHeader: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

describe("LearningPathsHeader Component", () => {
  it("should render header title and description", () => {
    render(<LearningPathsHeader />);

    expect(screen.getByText("Learning Paths")).toBeInTheDocument();

    expect(screen.getByText("Create and manage your learning paths")).toBeInTheDocument();
  });
});
