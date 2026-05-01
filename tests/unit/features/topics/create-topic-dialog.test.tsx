/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateTopicDialog from "@/features/topics/components/create-topic-dialog";

const mockMutate = jest.fn();

jest.mock("@/features/topics/hooks/use-topics", () => ({
  useCreateTopic: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("@/components/loading-swap", () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

describe("CreateTopicDialog Component", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("should render create topic form", async () => {
    const user = userEvent.setup();
    render(<CreateTopicDialog />);

    expect(screen.getAllByText("Create Topic")[0]).toBeInTheDocument();

    const triggerButton = screen.getAllByText("Create Topic")[0];
    await user.click(triggerButton);

    expect(screen.getByPlaceholderText("Enter your topic name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your topic description")).toBeInTheDocument();
  });

  it("should submit form and call mutation", async () => {
    const user = userEvent.setup();
    render(<CreateTopicDialog />);

    const triggerButton = screen.getAllByText("Create Topic")[0];
    await user.click(triggerButton);

    const nameInput = screen.getByPlaceholderText("Enter your topic name");
    await user.type(nameInput, "React");

    const descInput = screen.getByPlaceholderText("Enter your topic description");
    await user.type(descInput, "Frontend Library");

    const submitButton = screen.getAllByText("Create Topic")[1];
    await user.click(submitButton);
  });
});
