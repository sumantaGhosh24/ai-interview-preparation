/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";

import { useSuspenseQuestionsByTopic } from "@/features/questions/hooks/use-questions";
import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import QuestionsPagination from "@/features/questions/components/questions-pagination";

const mockSetParams = jest.fn();

jest.mock("@/features/questions/hooks/use-questions", () => ({
  useSuspenseQuestionsByTopic: jest.fn(),
}));

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

jest.mock("@/components/entity-components", () => ({
  EntityPagination: ({ page, totalPages, disabled, onPageChange }: any) => (
    <div>
      <div>Current Page: {page}</div>
      <div>Total Pages: {totalPages}</div>
      <div>{disabled ? "Disabled" : "Enabled"}</div>

      <button onClick={() => onPageChange(2)}>Go Page 2</button>
    </div>
  ),
}));

const mockedUseSuspenseQuestionsByTopic = useSuspenseQuestionsByTopic as jest.Mock;

const mockedUseGlobalParams = useGlobalParams as jest.Mock;

describe("QuestionsPagination Component", () => {
  beforeEach(() => {
    mockSetParams.mockClear();

    mockedUseGlobalParams.mockReturnValue([
      {
        search: "",
        page: 1,
      },
      mockSetParams,
    ]);
  });

  it("should render pagination values correctly", () => {
    mockedUseSuspenseQuestionsByTopic.mockReturnValue({
      isFetching: false,
      data: {
        totalPages: 5,
        page: 1,
      },
    });

    render(<QuestionsPagination topicId="topic_1" />);

    expect(screen.getByText("Current Page: 1")).toBeInTheDocument();

    expect(screen.getByText("Total Pages: 5")).toBeInTheDocument();

    expect(screen.getByText("Enabled")).toBeInTheDocument();
  });

  it("should update params on page change", () => {
    mockedUseSuspenseQuestionsByTopic.mockReturnValue({
      isFetching: false,
      data: {
        totalPages: 5,
        page: 1,
      },
    });

    render(<QuestionsPagination topicId="topic_1" />);

    fireEvent.click(screen.getByText("Go Page 2"));

    expect(mockSetParams).toHaveBeenCalledWith({
      search: "",
      page: 2,
    });
  });

  it("should pass disabled state when fetching", () => {
    mockedUseSuspenseQuestionsByTopic.mockReturnValue({
      isFetching: true,
      data: {
        totalPages: 5,
        page: 1,
      },
    });

    render(<QuestionsPagination topicId="topic_1" />);

    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });
});
