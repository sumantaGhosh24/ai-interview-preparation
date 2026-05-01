/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import EvaluationCard from "@/features/answers/components/evaluation-card";

const baseAnswer = {
  id: "1",
  content: "answer",
  status: "COMPLETED",
  statusMessage: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "user-1",
  questionId: "q1",
};

const mockAnswer = {
  ...baseAnswer,
  evaluation: {
    id: "eval-1",
    score: 8,
    modelAnswer: "This is a model answer",
    mistakes: [
      { id: "m1", content: "Mistake 1" },
      { id: "m2", content: "Mistake 2" },
    ],
    improvements: [
      { id: "i1", content: "Improvement 1" },
      { id: "i2", content: "Improvement 2" },
    ],
  },
};

describe("EvaluationCard", () => {
  it("renders nothing when evaluation is null", () => {
    const { container } = render(
      <EvaluationCard answer={{ ...mockAnswer, evaluation: null } as any} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders evaluation content", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    expect(screen.getByText(/ai feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/review your performance/i)).toBeInTheDocument();
  });

  it("displays score correctly", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    expect(screen.getByText("8/10")).toBeInTheDocument();
  });

  it("displays model answer", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    expect(screen.getByText("This is a model answer")).toBeInTheDocument();
  });

  it("renders all mistakes", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    expect(screen.getByText("Mistake 1")).toBeInTheDocument();
    expect(screen.getByText("Mistake 2")).toBeInTheDocument();
  });

  it("renders all improvements", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    expect(screen.getByText("Improvement 1")).toBeInTheDocument();
    expect(screen.getByText("Improvement 2")).toBeInTheDocument();
  });

  it("renders correct number of list items", () => {
    render(<EvaluationCard answer={mockAnswer as any} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });
});
