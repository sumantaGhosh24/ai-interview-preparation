/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { useSuspenseTopics } from "@/features/topics/hooks/use-topics";
import TopicsList from "@/features/topics/components/topics-list";

jest.mock("@/features/topics/components/topic-card", () => ({
  __esModule: true,
  default: ({ topic }: any) => <div>{topic.name}</div>,
}));

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useSuspenseTopics: jest.fn(),
}));

jest.mock("@/components/entity-components", () => ({
  EntityList: ({ items, renderItem, emptyView }: any) => (
    <div>{items.length > 0 ? items.map(renderItem) : emptyView}</div>
  ),

  EmptyView: ({ title, description }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

const mockedUseSuspenseTopics = useSuspenseTopics as jest.Mock;

describe("TopicsList Component", () => {
  it("should render topics list", () => {
    mockedUseSuspenseTopics.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            name: "React",
          },
          {
            id: "2",
            name: "Next.js",
          },
        ],
      },
    });

    render(<TopicsList />);

    expect(screen.getByText("React")).toBeInTheDocument();

    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("should show empty state when no topics exist", () => {
    mockedUseSuspenseTopics.mockReturnValue({
      data: {
        items: [],
      },
    });

    render(<TopicsList />);

    expect(screen.getByText("No Topic Found")).toBeInTheDocument();

    expect(screen.getByText("Currently you don't have any topics")).toBeInTheDocument();
  });
});
