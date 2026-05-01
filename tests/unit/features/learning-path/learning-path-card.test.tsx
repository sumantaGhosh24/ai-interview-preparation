/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useRemoveLearningPath } from "@/features/learning-path/hooks/use-learning-path";
import LearningPathCard from "@/features/learning-path/components/learning-path-card";

const mockMutate = jest.fn();

jest.mock("@/features/learning-path/hooks/use-learning-path", () => ({
  useRemoveLearningPath: jest.fn(),
}));

describe("LearningPathCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRemoveLearningPath as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  const mockLearningPath = {
    id: "lp-1",
    title: "React Mastery",
    duration: "4 Weeks",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user-1",
    topicId: "topic-1",
    phases: [
      {
        id: "phase-1",
        title: "React Basics",
        duration: "1 Week",
        createdAt: new Date(),
        updatedAt: new Date(),
        learningPathId: "lp-1",
        tasks: [
          {
            id: "task-1",
            task: "Learn JSX",
            resource: "https://react.dev",
            createdAt: new Date(),
            updatedAt: new Date(),
            phaseId: "phase-1",
          },
        ],
      },
    ],
  };

  it("should render learning path details", () => {
    render(<LearningPathCard learningPath={mockLearningPath as any} />);

    expect(screen.getByText("React Mastery")).toBeInTheDocument();

    expect(screen.getByText("React Basics")).toBeInTheDocument();

    expect(screen.getByText("Learn JSX")).toBeInTheDocument();
  });

  it("should show fallback when no phases exist", () => {
    render(
      <LearningPathCard
        learningPath={
          {
            ...mockLearningPath,
            phases: [],
          } as any
        }
      />,
    );

    expect(screen.getByText("No phases found in this learning path.")).toBeInTheDocument();
  });

  it("should call remove mutation on delete click", async () => {
    render(<LearningPathCard learningPath={mockLearningPath as any} />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith({
      id: "lp-1",
    });
  });
});
