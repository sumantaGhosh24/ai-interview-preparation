import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useCreateLearningPath } from "@/features/learning-path/hooks/use-learning-path";
import CreateLearningPath from "@/features/learning-path/components/create-learning-path";

const mockMutate = jest.fn();

jest.mock("@/features/learning-path/hooks/use-learning-path", () => ({
  useCreateLearningPath: jest.fn(),
}));

jest.mock("@/components/loading-swap", () => {
  return function MockLoadingSwap({
    children,
    isLoading,
  }: {
    children: React.ReactNode;
    isLoading: boolean;
  }) {
    return <div>{isLoading ? "Loading..." : children}</div>;
  };
});

describe("CreateLearningPath Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useCreateLearningPath as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should render create learning path button", () => {
    render(<CreateLearningPath topicId="topic-1" />);

    expect(screen.getByText("Create Learning Path")).toBeInTheDocument();
  });

  it("should call mutate with topicId on click", async () => {
    render(<CreateLearningPath topicId="topic-1" />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith({
      topicId: "topic-1",
    });
  });

  it("should show loading state after click", async () => {
    render(<CreateLearningPath topicId="topic-1" />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
