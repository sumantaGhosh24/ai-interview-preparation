/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import TopicsContainer from "@/features/topics/components/topics-container";

jest.mock("@/features/topics/components/topics-header", () => ({
  __esModule: true,
  default: () => <div>Topics Header</div>,
}));

jest.mock("@/features/topics/components/topics-pagination", () => ({
  __esModule: true,
  default: () => <div>Topics Pagination</div>,
}));

jest.mock("@/components/entity-components", () => ({
  EntityContainer: ({ header, search, pagination, children }: any) => (
    <div>
      <div>{header}</div>
      <div>{search}</div>
      <div>{pagination}</div>
      <div>{children}</div>
    </div>
  ),

  EntitySearch: ({ placeholder }: any) => <input placeholder={placeholder} readOnly />,
}));

describe("TopicsContainer Component", () => {
  it("should render layout sections correctly", () => {
    render(
      <TopicsContainer>
        <div>Topics Content</div>
      </TopicsContainer>,
    );

    expect(screen.getByText("Topics Header")).toBeInTheDocument();

    expect(screen.getByText("Topics Pagination")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Search topics")).toBeInTheDocument();

    expect(screen.getByText("Topics Content")).toBeInTheDocument();
  });
});
