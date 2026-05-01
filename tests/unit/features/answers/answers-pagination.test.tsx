/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import { useSuspenseAnswersHistory } from "@/features/answers/hooks/use-answers";
import AnswersPagination from "@/features/answers/components/answers-pagination";

jest.mock("@/hooks/use-answers", () => ({
  useSuspenseAnswersHistory: jest.fn(),
}));

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

const onPageChangeMock = jest.fn();

jest.mock("@/components/entity-components", () => ({
  __esModule: true,
  EntityPagination: ({ page, totalPages, disabled, onPageChange }: any) => {
    onPageChangeMock.mockImplementation(onPageChange);

    return (
      <div>
        <span>page:{page}</span>
        <span>total:{totalPages}</span>
        <span>disabled:{String(disabled)}</span>
        <button onClick={() => onPageChange(2)}>go-page-2</button>
      </div>
    );
  },
}));

describe("AnswersPagination", () => {
  const setParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useGlobalParams as jest.Mock).mockReturnValue([{ page: 1 }, setParams]);
  });

  const setup = ({ page = 1, totalPages = 5, isFetching = false } = {}) => {
    (useSuspenseAnswersHistory as jest.Mock).mockReturnValue({
      data: { page, totalPages },
      isFetching,
    });

    render(<AnswersPagination questionId="q1" />);
  };

  it("passes correct props to EntityPagination", () => {
    setup({ page: 2, totalPages: 10 });

    expect(screen.getByText("page:2")).toBeInTheDocument();
    expect(screen.getByText("total:10")).toBeInTheDocument();
    expect(screen.getByText("disabled:false")).toBeInTheDocument();
  });

  it("disables pagination when fetching", () => {
    setup({ isFetching: true });

    expect(screen.getByText("disabled:true")).toBeInTheDocument();
  });

  it("calls setParams on page change", async () => {
    const user = userEvent.setup();

    setup({ page: 1 });

    await user.click(screen.getByText("go-page-2"));

    expect(setParams).toHaveBeenCalledWith({
      page: 2,
    });
  });

  it("preserves existing params when changing page", async () => {
    const user = userEvent.setup();

    (useGlobalParams as jest.Mock).mockReturnValue([{ page: 1, filter: "recent" }, setParams]);

    setup();

    await user.click(screen.getByText("go-page-2"));

    expect(setParams).toHaveBeenCalledWith({
      page: 2,
      filter: "recent",
    });
  });
});
