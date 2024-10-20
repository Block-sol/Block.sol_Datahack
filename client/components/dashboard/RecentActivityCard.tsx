// RecentActivityCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import HistoryComponent from "../HistoryComponent";
import { QuizAttempt } from "@/components/types";

interface RecentActivityCardProps {
  recentActivity: QuizAttempt[];
  totalQuizzes: number;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ recentActivity, totalQuizzes }) => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {totalQuizzes} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent history={recentActivity} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
