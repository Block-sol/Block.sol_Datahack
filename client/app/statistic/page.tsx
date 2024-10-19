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

const Statistics = () => {

    const data = {
        total_questions: 43,
        total_correct: 11,
        total_wrong: 32,
        overall_accuracy: 0.2558139534883721,
        average_time: 2.280768250310144,
        difficulty_performance: {
          Easy: {
            accuracy: 0.2558139534883721,
            average_time: 2.280768250310144,
            total_questions: 43,
          },
        },
        challenging_questions: [
          {
            question: "Which of the following is a machine learning library?",
            accuracy: 0.0,
            average_time: 0.5537697672843933,
            attempts: 4,
          },
          {
            question: "Which of the following is an example of supervised learning?",
            accuracy: 0.0,
            average_time: 0.6478131294250489,
            attempts: 5,
          },
          {
            question: "Which algorithm is used for classification?",
            accuracy: 0.0,
            average_time: 0.7834178805351257,
            attempts: 4,
          },
        ],
        wrong_answers: [
          {
            question: "What is overfitting in machine learning?",
            user_answer: "D",
            correct_answer: "A",
            options: {
              A: "When the model performs well on training data but poorly on test data",
              B: "When the model performs well on both training and test data",
              C: "When the model performs poorly on both training and test data",
              D: "When the model performs poorly on training data but well on test data",
            },
            difficulty: "Easy",
            time_taken: 1.547417163848877,
          },
          {
            question: "Which evaluation metric is commonly used for classification tasks?",
            user_answer: "D",
            correct_answer: "B",
            options: {
              A: "Mean Squared Error",
              B: "Accuracy",
              C: "R-Squared",
              D: "Silhouette Score",
            },
            difficulty: "Easy",
            time_taken: 0.952620267868042,
          },
          {
            question: "Which of the following is a machine learning library?",
            user_answer: "A",
            correct_answer: "B",
            options: {
              A: "NumPy",
              B: "TensorFlow",
              C: "Matplotlib",
              D: "Jupyter",
            },
            difficulty: "Easy",
            time_taken: 0.537888765335083,
          },
        ],
      };
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
          <ResultsCard accuracy={data.overall_accuracy * 100} />
          <AccuracyCard accuracy={data.overall_accuracy * 100} />
          <TimeTakenCard averageTime={data.average_time} />
        </div>

        <QuestionsList questions={data.wrong_answers} />

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Challenging Questions</h3>
          <QuestionsList questions={data.challenging_questions} />
        </div>
      </div>
    </>
  );
};

export default Statistics;
