import { SetStateAction } from 'react';

export type FlashCardData = {
  id: number;
  title: string;
  question: string;
  options: string[];
  answerImage: string;
  explanation: string;
  correctOption: number;
  topics: string[];
};

export type CardProps = {
  data: FlashCardData;
  active: boolean;
  removeCard: (id: number, action: 'right' | 'left') => void;
};

export type SwipeButtonProps = {
  exit: (value: SetStateAction<number>) => void;
  removeCard: (id: number, action: 'right' | 'left') => void;
  id: number;
};