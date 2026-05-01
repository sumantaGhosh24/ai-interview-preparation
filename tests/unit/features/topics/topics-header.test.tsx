/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import TopicsHeader from "@/features/topics/components/topics-header";

jest.mock("@/features/topics/components/create-topic-dialog", () => ({
  __esModule: true,
  default: () => <button>Create Topic</button>,
}));

jest.mock("@/components/entity-components", () => ({
  EntityHeader: ({ title, description, create }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{create}</div>
    </div>
  ),
}));

describe("TopicsHeader Component", () => {
  it("should render header content", () => {
    render(<TopicsHeader />);

    expect(screen.getByText("Topics")).toBeInTheDocument();

    expect(screen.getByText("Create and manage your topics")).toBeInTheDocument();

    expect(screen.getByText("Create Topic")).toBeInTheDocument();
  });
});
