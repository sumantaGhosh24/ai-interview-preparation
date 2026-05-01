import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useSuspenseLearningPathByTopicId } from "@/features/learning-path/hooks/use-learning-path";
import LearningPath from "@/features/learning-path/components/learning-path";

const mockMutate = jest.fn();

jest.mock("@/features/learning-path/hooks/use-learning-path", () => ({
  useSuspenseLearningPathByTopicId: jest.fn(),
  useRemoveLearningPath: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("@/features/learning-path/components/create-learning-path", () => {
  return function MockCreateLearningPath({ topicId }: { topicId: string }) {
    return <div>Create Learning Path for {topicId}</div>;
  };
});

describe("LearningPath Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render create learning path when no learning path exists", () => {
    (useSuspenseLearningPathByTopicId as jest.Mock).mockReturnValue({
      data: null,
    });

    render(<LearningPath topicId="topic-1" />);

    expect(screen.getByText("Create Learning Path for topic-1")).toBeInTheDocument();
  });

  it("should render learning path details", () => {
    (useSuspenseLearningPathByTopicId as jest.Mock).mockReturnValue({
      data: {
        id: "lp-1",
        title: "React Mastery",
        duration: "4 Weeks",
        phases: [
          {
            id: "phase-1",
            title: "Basics",
            duration: "1 Week",
            tasks: [
              {
                id: "task-1",
                task: "Learn JSX",
                resource: "https://react.dev",
              },
            ],
          },
        ],
      },
    });

    render(<LearningPath topicId="topic-1" />);

    expect(screen.getByText("React Mastery")).toBeInTheDocument();

    expect(screen.getByText("Basics")).toBeInTheDocument();

    expect(screen.getByText("Learn JSX")).toBeInTheDocument();
  });

  it("should call remove mutation on delete click", async () => {
    (useSuspenseLearningPathByTopicId as jest.Mock).mockReturnValue({
      data: {
        id: "lp-1",
        title: "React Mastery",
        duration: "4 Weeks",
        phases: [],
      },
    });

    render(<LearningPath topicId="topic-1" />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith({
      id: "lp-1",
    });
  });
});
