// types.ts
export interface CardData {
    id: number | string;
    title: string;
    question: string;
    options: string[];
    answerImage: string;
    explanation: string;
  }
  
  export interface QuizAttempt {
    id: string;
    topic: string;
    gameType: 'mcq' | 'open_ended';
    timeStarted: string;
    timeEnded: string;
  }