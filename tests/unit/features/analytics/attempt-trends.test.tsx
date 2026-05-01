import { render, screen } from "@testing-library/react";

import { useSuspenseAttemptTrends } from "@/features/analytics/hooks/use-analytics";
import AttemptTrends from "@/features/analytics/components/attempt-trends";

jest.mock("@/hooks/use-analytics", () => ({
  useSuspenseAttemptTrends: jest.fn(),
}));

describe("AttemptTrends", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-30"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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

  it("renders total attempts correctly", () => {
    setup({
      "2025-01-29": 2,
      "2025-01-30": 3,
    });

    expect(screen.getByText(/total attempts:/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders peak value correctly", () => {
    setup({
      "2025-01-28": 1,
      "2025-01-29": 5,
      "2025-01-30": 3,
    });

    expect(screen.getByText(/peak:/i)).toBeInTheDocument();
    expect(screen.getByText(/5 in one day/i)).toBeInTheDocument();
  });

  it("fills missing dates with zero", () => {
    setup({
      "2025-01-30": 4,
    });

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders bars when data exists", () => {
    setup({
      "2025-01-29": 2,
      "2025-01-30": 3,
    });

    const bars = screen.getAllByTitle(/attempt/);
    expect(bars.length).toBeGreaterThan(0);
  });

  it("renders correct tooltip titles", () => {
    setup({
      "2025-01-30": 1,
    });

    expect(screen.getByTitle("2025-01-30: 1 attempt")).toBeInTheDocument();
  });

  it("pluralizes tooltip correctly", () => {
    setup({
      "2025-01-30": 2,
    });

    expect(screen.getByTitle("2025-01-30: 2 attempts")).toBeInTheDocument();
  });
});
