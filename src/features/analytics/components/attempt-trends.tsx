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
