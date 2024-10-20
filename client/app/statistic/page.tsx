import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { LucideLayoutDashboard } from "lucide-react";
import React from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";

type Props = {
  data: {
    total_questions: number;
    total_correct: number;
    total_wrong: number;
    overall_accuracy: number;
    average_time: number;
    challenging_questions: { question: string; accuracy: number; average_time: number; attempts: number }[];
    wrong_answers: { question: string; user_answer: string; correct_answer: string; options: Record<string, string>; difficulty: string; time_taken: number }[];
  };
};

const Statistics: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard 
            totalQuestions={data.total_questions}
            correctAnswers={data.total_correct}
            wrongAnswers={data.total_wrong}
          />
          <AccuracyCard accuracy={data.overall_accuracy * 100} />
          <TimeTakenCard averageTime={data.average_time} />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Incorrect Answers</h3>
          <QuestionsList questions={data.wrong_answers} />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Challenging Questions</h3>
          <QuestionsList questions={data.challenging_questions} />
        </div>
      </div>
    </>
  );
};

export default Statistics;