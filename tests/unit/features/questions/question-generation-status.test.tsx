import { render, screen } from "@testing-library/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import QuestionGenerationStatus from "@/features/questions/components/question-generation-status";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("@/trpc/client", () => ({
  useTRPC: jest.fn(),
}));

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

const mockedUseQuery = useQuery as jest.Mock;
const mockedUseQueryClient = useQueryClient as jest.Mock;
const mockedUseTRPC = useTRPC as jest.Mock;
const mockedUseGlobalParams = useGlobalParams as jest.Mock;

const mockInvalidateQueries = jest.fn();

describe("QuestionGenerationStatus Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    mockedUseGlobalParams.mockReturnValue([
      {
        page: 1,
        search: "",
      },
    ]);

    mockedUseTRPC.mockReturnValue({
      questions: {
        getGenerationStatus: {
          queryOptions: jest.fn(() => ({})),
        },
        getByTopic: {
          queryOptions: jest.fn(() => ({})),
        },
      },
    });
  });

  it("should render running state", () => {
    mockedUseQuery.mockReturnValue({
      data: {
        status: "RUNNING",
        statusMessage: "Generating questions...",
      },
    });

    render(<QuestionGenerationStatus jobId="job_1" topicId="topic_1" />);

    expect(screen.getByText("AI Question Generation")).toBeInTheDocument();

    expect(screen.getByText("Generating questions...")).toBeInTheDocument();

    expect(screen.getByText("65%")).toBeInTheDocument();

    expect(
      screen.getByText("Generating personalized AI questions for this topic..."),
    ).toBeInTheDocument();
  });

  it("should render completed state", () => {
    mockedUseQuery.mockReturnValue({
      data: {
        status: "COMPLETED",
        statusMessage: "Questions generated successfully",
      },
    });

    render(<QuestionGenerationStatus jobId="job_2" topicId="topic_1" />);

    expect(screen.getByText("100%")).toBeInTheDocument();

    expect(screen.getByText("Questions generated successfully and saved.")).toBeInTheDocument();
  });

  it("should render failed state", () => {
    mockedUseQuery.mockReturnValue({
      data: {
        status: "FAILED",
        statusMessage: "Generation failed",
      },
    });

    render(<QuestionGenerationStatus jobId="job_3" topicId="topic_1" />);

    expect(screen.getByText("Generation failed")).toBeInTheDocument();

    expect(screen.getByText("Failed to generate questions. Please try again.")).toBeInTheDocument();
  });

  it("should return null when jobId is missing", () => {
    mockedUseQuery.mockReturnValue({
      data: null,
    });

    const { container } = render(<QuestionGenerationStatus jobId="" topicId="topic_1" />);

    expect(container.firstChild).toBeNull();
  });
});
