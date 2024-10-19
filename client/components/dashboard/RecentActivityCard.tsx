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

const STATIC_GAME_HISTORY = [
  {
    id: 1,
    topic: "Neural Networks Fundamentals",
    gameType: "mcq",
    timeEnded: "2024-10-15T10:30:00",
    timeStarted: "2024-10-15T10:00:00"
  },
  {
    id: 2,
    topic: "Deep Learning Architecture",
    gameType: "open_ended",
    timeEnded: "2024-10-14T15:45:00",
    timeStarted: "2024-10-14T15:15:00"
  },
  {
    id: 3,
    topic: "Supervised Learning",
    gameType: "mcq",
    timeEnded: "2024-10-13T09:20:00",
    timeStarted: "2024-10-13T08:50:00"
  },
  {
    id: 4,
    topic: "Computer Vision Basics",
    gameType: "mcq",
    timeEnded: "2024-10-12T14:30:00",
    timeStarted: "2024-10-12T14:00:00"
  },
  {
    id: 5,
    topic: "Natural Language Processing",
    gameType: "open_ended",
    timeEnded: "2024-10-11T11:15:00",
    timeStarted: "2024-10-11T10:45:00"
  }
];

const RecentActivityCard = () => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {STATIC_GAME_HISTORY.length} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
