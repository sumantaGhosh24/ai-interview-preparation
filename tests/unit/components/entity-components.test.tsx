/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";

import {
  EntityContainer,
  EntityHeader,
  EntitySearch,
  EntityPagination,
  LoadingView,
  ErrorView,
  EmptyView,
  EntityList,
} from "@/components/entity-components";

const pushMock = jest.fn();
const onSearchChangeMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: () => [{ search: "" }, jest.fn()],
}));

jest.mock("@/hooks/use-entity-search", () => ({
  useEntitySearch: () => ({
    searchValue: "",
    onSearchChange: onSearchChangeMock,
  }),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: any) => <div>{children}</div>,
  PaginationContent: ({ children }: any) => <div>{children}</div>,
  PaginationItem: ({ children }: any) => <div>{children}</div>,
  PaginationNext: (props: any) => (
    <button data-testid="next" {...props}>
      Next
    </button>
  ),
  PaginationPrevious: (props: any) => (
    <button data-testid="prev" {...props}>
      Prev
    </button>
  ),
}));

jest.mock("@/components/ui/empty", () => ({
  Empty: ({ children }: any) => <div>{children}</div>,
  EmptyHeader: ({ children }: any) => <div>{children}</div>,
  EmptyContent: ({ children }: any) => <div>{children}</div>,
  EmptyMedia: ({ children }: any) => <div>{children}</div>,
  EmptyTitle: ({ children }: any) => <div>{children}</div>,
  EmptyDescription: ({ children }: any) => <div>{children}</div>,
}));

describe("Entity Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EntityContainer with all sections", () => {
    render(
      <EntityContainer
        header={<div>Header</div>}
        search={<div>Search</div>}
        pagination={<div>Pagination</div>}
      >
        <div>Content</div>
      </EntityContainer>,
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Pagination")).toBeInTheDocument();
  });

  it("renders EntityHeader correctly", () => {
    render(
      <EntityHeader
        title="Test Title"
        description="Test Description"
        create={<button>Create</button>}
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("EntitySearch triggers onSearchChange", () => {
    render(<EntitySearch placeholder="Search here" />);

    fireEvent.change(screen.getByPlaceholderText("Search here"), {
      target: { value: "test" },
    });

    expect(onSearchChangeMock).toHaveBeenCalledWith("test");
  });

  it("EntityPagination handles navigation", () => {
    const onPageChange = jest.fn();

    render(<EntityPagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByTestId("prev"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByTestId("next"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("EntityPagination disables buttons at limits", () => {
    const onPageChange = jest.fn();

    render(<EntityPagination page={1} totalPages={1} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByTestId("prev"));
    fireEvent.click(screen.getByTestId("next"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("renders LoadingView", () => {
    render(<LoadingView />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });

  it("ErrorView triggers redirect", () => {
    render(
      <ErrorView
        title="Error"
        description="Something went wrong"
        buttonText="Go Back"
        redirectUrl="/home"
      />,
    );

    fireEvent.click(screen.getByText("Go Back"));

    expect(pushMock).toHaveBeenCalledWith("/home");
  });

  it("EmptyView triggers redirect", () => {
    render(
      <EmptyView
        title="No Data"
        description="Nothing here"
        buttonText="Create"
        redirectUrl="/create"
      />,
    );

    fireEvent.click(screen.getByText("Create"));

    expect(pushMock).toHaveBeenCalledWith("/create");
  });

  it("EntityList renders items", () => {
    render(<EntityList items={[1, 2, 3]} renderItem={(item) => <div>Item {item}</div>} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("EntityList shows empty view", () => {
    render(
      <EntityList
        items={[]}
        renderItem={(item) => <div>{item}</div>}
        emptyView={<div>No items</div>}
      />,
    );

    expect(screen.getByText("No items")).toBeInTheDocument();
  });
});
