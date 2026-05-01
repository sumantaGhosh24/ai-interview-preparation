"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSuspenseWeakTopics } from "../hooks/use-analytics";
import { Card } from "@/components/ui/card";

const WeakTopics = () => {
  const { data: weakTopics } = useSuspenseWeakTopics();

  return (
    <Card className="space-y-4 mb-5 p-5">
      <h2 className="text-xl font-semibold">Weakest Topics</h2>
      {!weakTopics || weakTopics.length === 0 ? (
        <div className="text-muted-foreground">No weak topics found. Great job!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic Name</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Attempts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weakTopics.map((item) => (
              <TableRow key={item.topicId}>
                <TableCell className="font-medium capitalize">{item.topicName}</TableCell>
                <TableCell>{(item.accuracy * 100).toFixed(1)}%</TableCell>
                <TableCell>{item.avgScore.toFixed(2)}</TableCell>
                <TableCell>{item.attemptCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default WeakTopics;
