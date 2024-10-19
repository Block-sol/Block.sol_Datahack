'use client'
import FlashCard from '@/components/SwipeCards/FlashCard';
import { FlashCardData } from '@/components/SwipeCards/index';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';


const sampleCards: FlashCardData[] = [
    {
      id: 1,
      title: 'Flashcard 1',
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Rome'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The capital of France is Paris.',
      correctOption: 0,
      topics: ['Geography', 'Europe', 'Capitals'],
    },
    {
      id: 2,
      title: 'Flashcard 2',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The correct answer is 4.',
      correctOption: 1,
      topics: ['Math', 'Basic Arithmetic'],
    },
    {
      id: 3,
      title: 'Flashcard 3',
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'Mars is known as the Red Planet.',
      correctOption: 1,
      topics: ['Science', 'Astronomy', 'Planets'],
    },
    {
      id: 4,
      title: 'Flashcard 4',
      question: 'Who wrote "Hamlet"?',
      options: ['Shakespeare', 'Charles Dickens', 'Mark Twain', 'Hemingway'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'Hamlet was written by William Shakespeare.',
      correctOption: 0,
      topics: ['Literature', 'Shakespeare', 'Plays'],
    },
    {
      id: 5,
      title: 'Flashcard 5',
      question: 'What is the square root of 16?',
      options: ['2', '4', '6', '8'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The square root of 16 is 4.',
      correctOption: 1,
      topics: ['Math', 'Algebra'],
    },
    {
      id: 6,
      title: 'Flashcard 6',
      question: 'What is the boiling point of water?',
      options: ['50°C', '75°C', '100°C', '120°C'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'Water boils at 100°C.',
      correctOption: 2,
      topics: ['Science', 'Physics', 'Temperature'],
    },
    {
      id: 7,
      title: 'Flashcard 7',
      question: 'What is the currency of Japan?',
      options: ['Yen', 'Dollar', 'Euro', 'Won'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The currency of Japan is the Yen.',
      correctOption: 0,
      topics: ['Economics', 'Currencies', 'Japan'],
    },
    {
      id: 8,
      title: 'Flashcard 8',
      question: 'Who painted the Mona Lisa?',
      options: ['Leonardo da Vinci', 'Van Gogh', 'Picasso', 'Michelangelo'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The Mona Lisa was painted by Leonardo da Vinci.',
      correctOption: 0,
      topics: ['Art', 'Renaissance', 'Painting'],
    },
    {
      id: 9,
      title: 'Flashcard 9',
      question: 'Which element is represented by the symbol O?',
      options: ['Oxygen', 'Osmium', 'Oganesson', 'Ozone'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The symbol O represents Oxygen in the periodic table.',
      correctOption: 0,
      topics: ['Science', 'Chemistry', 'Elements'],
    },
    {
      id: 10,
      title: 'Flashcard 10',
      question: 'What is the chemical formula of water?',
      options: ['H2O', 'O2', 'CO2', 'NaCl'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'The chemical formula of water is H2O.',
      correctOption: 0,
      topics: ['Science', 'Chemistry', 'Compounds'],
    },
    {
      id: 11,
      title: 'Flashcard 11',
      question: 'Who discovered gravity?',
      options: ['Newton', 'Einstein', 'Galileo', 'Tesla'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'Isaac Newton is credited with discovering gravity.',
      correctOption: 0,
      topics: ['Science', 'Physics', 'History'],
    },
    {
      id: 12,
      title: 'Flashcard 12',
      question: 'Which gas do plants absorb for photosynthesis?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      answerImage: 'https://via.placeholder.com/150',
      explanation: 'Plants absorb Carbon Dioxide (CO2) for photosynthesis.',
      correctOption: 1,
      topics: ['Science', 'Biology', 'Photosynthesis'],
    },
  ];

export default function FlashcardPage() {
  const [cards, setCards] = useState<FlashCardData[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    setCards(sampleCards);
  }, []);

  const activeIndex = cards.length - 1;
  const removeCard = (id: number, action: 'right' | 'left') => {
    console.log('CALLED WHEN RIGHT');
    setCards((prev) => prev.filter((card) => card.id !== id));
    if (action === 'right') {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
      <AnimatePresence>
        {cards.length ? (
          cards.map((card, index) => (
            <FlashCard
              key={card.id}
              data={card}
              active={index === activeIndex}
              removeCard={removeCard}
            />
          ))
        ) : (
          <h2 className="text-center text-2xl font-bold text-gray-800">
            You've completed all flashcards!
            <br />
            Correct: {correctAnswers} | Incorrect: {incorrectAnswers}
          </h2>
        )}
      </AnimatePresence>
    </div>
  );
}