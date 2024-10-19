"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QuestionProps = {
  question: string;
  user_answer?: string;
  correct_answer?: string;
  options?: Record<string, string>;
  attempts?: number;
  accuracy?: number;
  average_time?: number;
};

type Props = {
  questions: QuestionProps[];
};

const QuestionsList = ({ questions }: Props) => {
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Your Answer</TableHead>
          <TableHead>Correct Answer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(({ question, user_answer, correct_answer }, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{question}</TableCell>
            <TableCell className={`font-semibold ${user_answer === correct_answer ? "text-green-600" : "text-red-600"}`}>
              {user_answer}
            </TableCell>
            <TableCell>{correct_answer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
