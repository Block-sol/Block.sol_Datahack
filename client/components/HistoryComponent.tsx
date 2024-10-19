
// HotTopicsCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "@/components/WordCloud";

const ML_TOPICS = [
  { text: "Neural Networks", value: 100 },
  { text: "Deep Learning", value: 85 },
  { text: "Machine Learning", value: 80 },
  { text: "Computer Vision", value: 75 },
  { text: "Natural Language Processing", value: 70 },
  { text: "Reinforcement Learning", value: 65 },
  { text: "Data Preprocessing", value: 60 },
  { text: "Model Evaluation", value: 55 },
  { text: "Feature Engineering", value: 50 },
  { text: "Transfer Learning", value: 45 },
  { text: "CNN", value: 40 },
  { text: "RNN", value: 35 },
  { text: "LSTM", value: 30 },
  { text: "Transformers", value: 25 },
  { text: "GANs", value: 20 }
];

const HotTopicsCard = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <WordCloud formattedTopics={ML_TOPICS} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;