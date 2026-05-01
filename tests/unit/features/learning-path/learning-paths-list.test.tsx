/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseLearningPaths } from "@/features/learning-path/hooks/use-learning-path";
import LearningPathsList from "@/features/learning-path/components/learning-paths-list";

jest.mock("@/features/learning-path/hooks/use-learning-path", () => ({
  useSuspenseLearningPaths: jest.fn(),
}));

jest.mock("@/features/learning-path/components/learning-path-card", () => {
  return function MockLearningPathCard({
    learningPath,
  }: {
    learningPath: {
      id: string;
      title: string;
    };
  }) {
    return <div>{learningPath.title}</div>;
  };
});

jest.mock("@/components/entity-components", () => ({
  EntityList: ({
    items,
    renderItem,
    emptyView,
  }: {
    items: any[];
    renderItem: (item: any) => React.ReactNode;
    emptyView: React.ReactNode;
  }) => <div>{items.length === 0 ? emptyView : items.map(renderItem)}</div>,

  EmptyView: ({ title, description }: { title: string; description: string }) => (
    <div>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

describe("LearningPathsList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render learning paths list", () => {
    (useSuspenseLearningPaths as jest.Mock).mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            title: "React Interview Prep",
          },
          {
            id: "2",
            title: "DSA Roadmap",
          },
        ],
      },
    });

    render(<LearningPathsList />);

    expect(screen.getByText("React Interview Prep")).toBeInTheDocument();

    expect(screen.getByText("DSA Roadmap")).toBeInTheDocument();
  });

  it("should render empty state when no learning paths exist", () => {
    (useSuspenseLearningPaths as jest.Mock).mockReturnValue({
      data: {
        items: [],
      },
    });

    render(<LearningPathsList />);

    expect(screen.getByText("No Learning Path Found")).toBeInTheDocument();

    expect(screen.getByText("Currently you don't have any learning paths")).toBeInTheDocument();
  });
});
