/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";

import TopicsPagination from "@/features/topics/components/topics-pagination";

const mockSetParams = jest.fn();

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useSuspenseTopics: () => ({
    isFetching: false,
    data: {
      totalPages: 5,
      page: 2,
    },
  }),
}));

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: () => [{ page: 2, search: "" }, mockSetParams],
}));

jest.mock("@/components/entity-components", () => ({
  EntityPagination: ({ totalPages, page, onPageChange }: any) => (
    <div>
      <div>Pages: {totalPages}</div>
      <div>Current Page: {page}</div>

      <button onClick={() => onPageChange(3)}>Change Page</button>
    </div>
  ),
}));

describe("TopicsPagination Component", () => {
  it("should render pagination values", () => {
    render(<TopicsPagination />);

    expect(screen.getByText("Pages: 5")).toBeInTheDocument();

    expect(screen.getByText("Current Page: 2")).toBeInTheDocument();
  });

  it("should call setParams when page changes", () => {
    render(<TopicsPagination />);

    fireEvent.click(screen.getByText("Change Page"));

    expect(mockSetParams).toHaveBeenCalledWith({
      page: 3,
      search: "",
    });
  });
});
