"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useSuspenseAttemptTrends } from "../hooks/use-analytics";

function getLast30Days() {
  const days: string[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const AttemptTrends = () => {
  const { data: trends } = useSuspenseAttemptTrends();
  const days = getLast30Days();

  const trendData = days.map((date) => ({
    date,
    count: trends?.[date] ?? 0,
  }));

  const maxCount = trendData.reduce((max, data) => Math.max(max, data.count), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attempt Trends (Last 30 Days)</CardTitle>
        <CardDescription>
          Attempts made per day. See your activity patterns over the last month.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {maxCount === 0 ? (
          <div className="text-muted-foreground text-center">No activity in the last 30 days.</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-0.5 h-24 sm:h-28 md:h-32 overflow-x-auto px-2 bg-muted rounded">
              {trendData.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count} attempt${d.count === 1 ? "" : "s"}`}
                  className="flex flex-col items-center justify-end"
                  style={{ width: 10, minWidth: 10 }}
                >
                  <div
                    className={`rounded-t bg-primary transition-all`}
                    style={{
                      height: maxCount > 0 ? `${(d.count / maxCount) * 100}%` : "0%",
                      minHeight: d.count > 0 ? 8 : 2,
                      width: 8,
                      opacity: d.count === 0 ? 0.4 : 1,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-0.5 px-2 select-none">
              {trendData.map((d, i) => (
                <div
                  key={d.date}
                  className="text-[10px] text-muted-foreground"
                  style={{ width: 10, minWidth: 10, textAlign: "center" }}
                >
                  {i === 0 || i === trendData.length - 1 || i % 5 === 0 ? d.date.slice(5) : ""}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm mt-6 text-muted-foreground">
              <div>
                <span className="font-medium">Total Attempts:</span>{" "}
                {trendData.reduce((sum, d) => sum + d.count, 0)}
              </div>
              <div>
                <span className="font-medium">Peak:</span> {maxCount} in one day
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttemptTrends;
