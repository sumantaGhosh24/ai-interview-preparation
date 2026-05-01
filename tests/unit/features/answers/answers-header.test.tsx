/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import AnswersHeader from "@/features/answers/components/answers-header";

jest.mock("@/components/entity-components", () => ({
  __esModule: true,
  EntityHeader: ({ title, description }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

describe("AnswersHeader", () => {
  it("renders title and description", () => {
    render(<AnswersHeader />);

    expect(screen.getByText("Your Answers")).toBeInTheDocument();
    expect(screen.getByText("You answers of this question")).toBeInTheDocument();
  });
});
