import { render, screen } from "@testing-library/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import EvaluationStatus from "@/features/answers/components/evaluation-status";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("@/trpc/client", () => ({
  useTRPC: jest.fn(),
}));

describe("EvaluationStatus", () => {
  const invalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries,
    });

    (useTRPC as jest.Mock).mockReturnValue({
      answers: {
        getSubmissionStatus: {
          queryOptions: jest.fn().mockReturnValue({}),
        },
        getAnswersHistory: {
          queryOptions: jest.fn().mockReturnValue({ queryKey: ["history"] }),
        },
      },
    });
  });

  const setup = (status?: string, statusMessage?: string) => {
    (useQuery as jest.Mock).mockReturnValue({
      data: status ? { status, statusMessage } : undefined,
    });

    render(<EvaluationStatus answerId="answer-1" questionId="question-1" />);
  };

  it("renders default pending state", () => {
    setup();

    expect(screen.getByText(/ai evaluation status/i)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it("renders running state", () => {
    setup("RUNNING", "Processing...");

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });

  it("renders completed state", () => {
    setup("COMPLETED", "Done!");

    expect(screen.getByText(/done!/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it("renders failed state", () => {
    setup("FAILED", "Something went wrong");

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it("uses fallback message when none provided", () => {
    setup("RUNNING");

    expect(screen.getByText(/ai evaluation is being processed/i)).toBeInTheDocument();
  });

  it("invalidates query when completed", () => {
    setup("COMPLETED");

    expect(invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["history"] }),
    );
  });

  it("does not invalidate query when not completed", () => {
    setup("RUNNING");

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
