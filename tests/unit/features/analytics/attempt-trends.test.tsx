import { render, screen } from "@testing-library/react";

import { useSuspenseAttemptTrends } from "@/features/analytics/hooks/use-analytics";
import AttemptTrends from "@/features/analytics/components/attempt-trends";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseAttemptTrends: jest.fn(),
}));

describe("AttemptTrends", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (data: Record<string, number> | null) => {
    (useSuspenseAttemptTrends as jest.Mock).mockReturnValue({
      data,
    });

    render(<AttemptTrends />);
  };

  it("renders empty state when no activity", () => {
    setup({});

    expect(screen.getByText(/no activity in the last 30 days/i)).toBeInTheDocument();
  });
});
