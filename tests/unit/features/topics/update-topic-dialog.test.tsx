import { render, screen, fireEvent } from "@testing-library/react";

import UpdateTopicDialog from "@/features/topics/components/update-topic-dialog";

const mockMutate = jest.fn();

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useUpdateTopic: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("UpdateTopicDialog Component", () => {
  const defaultProps = {
    id: "topic_1",
    name: "React",
    description: "Frontend library",
  };

  it("should render edit button", () => {
    render(<UpdateTopicDialog {...defaultProps} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should open dialog when edit button is clicked", () => {
    render(<UpdateTopicDialog {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));
  });

  it("should show existing values in form", () => {
    render(<UpdateTopicDialog {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByDisplayValue("React")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Frontend library")).toBeInTheDocument();
  });

  it("should call mutate on form submit", () => {
    render(<UpdateTopicDialog {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));

    fireEvent.change(screen.getByDisplayValue("React"), {
      target: {
        value: "Next.js",
      },
    });

    fireEvent.change(screen.getByDisplayValue("Frontend library"), {
      target: {
        value: "Fullstack framework",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update topic/i,
      }),
    );
  });
});
