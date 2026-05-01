/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import TopicCard from "@/features/topics/components/topic-card";

const mockMutate = jest.fn();

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useRemoveTopic: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("@/features/topics/components/update-topic-dialog", () => ({
  __esModule: true,
  default: () => <button>Update Topic</button>,
}));

describe("TopicCard Component", () => {
  const mockTopic = {
    id: "topic_1",
    name: "React",
    description: "Frontend library",
  };

  it("should render topic details", () => {
    render(<TopicCard topic={mockTopic as any} />);

    expect(screen.getByText("React")).toBeInTheDocument();

    expect(screen.getByText("Frontend library")).toBeInTheDocument();

    expect(screen.getByText("Update Topic")).toBeInTheDocument();
  });

  it("should not render description if empty", () => {
    render(
      <TopicCard
        topic={
          {
            ...mockTopic,
            description: "",
          } as any
        }
      />,
    );

    expect(screen.queryByText("Frontend library")).not.toBeInTheDocument();
  });
});
