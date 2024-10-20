'use client'
import FlashCard from '@/components/SwipeCards/FlashCard';
import { FlashCardData } from '@/components/SwipeCards/index';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Statistics from '../statistic/page';

export default function FlashcardPage() {
  const [cards, setCards] = useState<FlashCardData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<FlashCardData | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [embedLink, setEmbedLink] = useState<string | null>(null);  // To store the YouTube embed link
  const [error, setError] = useState<string | null>(null);

  // A reusable fetch function to hit your Flask API and handle the response
async function fetchYouTubeEmbedLink(
  keywords: string[]                                // Array of keywords to send to the API      // Function to set the error message in the state
) {
  try {
    
    const response = await fetch('http://127.0.0.1:5000/get_embed_link', { // URL of your Flask API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "keywords" : keywords  }), // Send the keywords in the request body
    });

    const data = await response.json();

    if (response.ok) {
      // If the request was successful, set the embed link in state
      setEmbedLink(data.embed_link);
      setError(null); // Clear any previous error
    } else {
      // If the request failed, set the error message
      setError(data.message || 'Something went wrong');
      setEmbedLink(null); // Clear the embed link
    }
  } catch (error: any) {
    // Handle network or other errors
    console.error('Error fetching embed link:', error);
    setError('Failed to fetch the embed link. Please try again.');
    setEmbedLink(null);
  }
}






  const [reportData, setReportData] = useState<any>(null);
  

  const { userEmail } = useAuth();

  useEffect(() => {

    // WebSocket connection
    const socket = new WebSocket('ws://localhost:8765');
    setSocket(socket);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      // Handle different message types
      switch (data.type) {
        case 'question':
          console.log('Received question:', data.data);
          await fetchYouTubeEmbedLink(data.data.related_topics);
          setCurrentQuestion(data.data);
          // TODO: Update UI with the new question
          break;
        case 'answer_result':
          console.log('Received answer result:', data.data);
          // TODO: Update UI with the answer result
          break;
        case 'report':
          console.log('Received final report:', data.data);
          setReportData(data.data);
          saveReportToFirebase(data.data);
          // TODO: Display the final report
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const saveReportToFirebase = async (reportData: any) => {
   
    const testId = `test${Date.now()}`; // Generate a unique test ID

    try {
      if(userEmail) {
      await setDoc(doc(db, 'Users', userEmail, 'Tests', testId), {
        type: 'report',
        data: reportData
      });
      console.log('Report saved to Firebase');
    }
    } catch (error) {
      console.error('Error saving report to Firebase:', error);
    }
  };

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

  if (reportData) {
    return <Statistics data={reportData} />;
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
      <AnimatePresence>
        {currentQuestion ? (         
            <FlashCard
              key={currentQuestion.id}
              websocket = {socket}
              data={currentQuestion}
              active={true}
              removeCard={removeCard}
              embedLink={embedLink}
            />
          )
         : (
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