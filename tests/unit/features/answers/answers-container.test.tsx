/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import AnswersContainer from "@/features/answers/components/answers-container";

jest.mock("@/components/answers-header", () => ({
  __esModule: true,
  default: () => <div>MockHeader</div>,
}));

jest.mock("@/components/answers-pagination", () => ({
  __esModule: true,
  default: ({ questionId }: any) => <div>Pagination:{questionId}</div>,
}));

jest.mock("@/components/entity-components", () => ({
  __esModule: true,
  EntityContainer: ({ header, search, pagination, children }: any) => (
    <div>
      <div data-testid="header">{header}</div>
      <div data-testid="search">{search}</div>
      <div data-testid="pagination">{pagination}</div>
      <div data-testid="children">{children}</div>
    </div>
  ),
  EntitySearch: ({ placeholder }: any) => <input placeholder={placeholder} />,
}));

describe("AnswersContainer", () => {
  it("renders header, search, pagination and children", () => {
    render(
      <AnswersContainer questionId="q1">
        <div>ChildContent</div>
      </AnswersContainer>,
    );

    expect(screen.getByText("MockHeader")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Search questions")).toBeInTheDocument();

    expect(screen.getByText("Pagination:q1")).toBeInTheDocument();

    expect(screen.getByText("ChildContent")).toBeInTheDocument();
  });
});
