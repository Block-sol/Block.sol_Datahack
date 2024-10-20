import { CardProps } from './index';
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

const FlashCard = ({ data, active, removeCard, websocket,embedLink }: CardProps) => {
  const [exitX, setExitX] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { userEmail } = useAuth();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    if (active) {
      setStartTime(Date.now());
      setFlipped(false);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [active, data]);

  const dragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setExitX(200);
      removeCard(data.id, 'right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      removeCard(data.id, 'left');
    }
  };

  const handleOptionSelect = (index: string) => {
    if (!flipped) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setFlipped(true);
      setIsCorrect(selectedOption === data.correctAnswer);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null && startTime !== null) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;

      const response = {
        answer: selectedOption,
        time_taken: timeTaken
      };

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(response));
      }

      setExitX(isCorrect ? 200 : -200);
      removeCard(data.id, isCorrect ? 'right' : 'left');
    }
  };

  return (
    <>
      {active && (
        <motion.div
          drag={!flipped ? "x" : false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          className="card absolute z-30 w-[400px] h-[600px] self-center perspective"
          onDragEnd={dragEnd}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1.05, opacity: 1 }}
          style={{ x, rotate, opacity }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeIn' }}
          whileDrag={{ cursor: 'grabbing' }}
          exit={{ x: exitX }}
        >
          <motion.div
            className="relative w-full h-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <motion.div
              className={`absolute w-full h-full backface-hidden ${
                flipped ? 'invisible' : 'visible'
              }`}
            >
              <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="flex h-full flex-col p-6">
                  <h2 className="mb-4 text-2xl font-bold text-gray-800">{data.question}</h2>
                  
                  <div className="flex-grow space-y-4">
                    {Object.entries(data.options).map(([key, value]) => (
                      <button
                        key={key}
                        className={`w-full rounded-lg py-3 px-4 text-left transition-colors ${
                          selectedOption === key
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => handleOptionSelect(key)}
                      >
                        {key}: {value}
                      </button>
                    ))}
                  </div>

                  <button
                    className="w-full rounded-lg bg-teal-600 py-3 px-4 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50 mt-4"
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Back of card */}
            <motion.div
              className={`absolute w-full h-full backface-hidden ${
                flipped ? 'visible' : 'invisible'
              }`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex justify-between">
                    <div className={`inline-block px-4 py-2 rounded-full ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </div>
                    <div className={`
                      inline-block px-4 py-2 rounded-full
                      ${data.difficulty.toLowerCase() === 'easy' 
                        ? 'bg-green-100 text-green-800' 
                        : data.difficulty.toLowerCase() === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : data.difficulty.toLowerCase() === 'hard'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'}
                    `}>
                      {data.difficulty}
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Explanation:</h3>
                    <p className="text-gray-700">{data.explanation}</p>
                  </div>
                  {embedLink && (
                   <div className="w-full h-56 mb-4">
                     <iframe
                       width="100%"
                       height="100%"
                       src={`${embedLink}`}
                       title="YouTube video player"
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     ></iframe>
                   </div>
                 )}
           
                             <div className="mt-4 flex flex-wrap gap-2">
                    {data.related_topics.map((item, idx) => (
                      <span key={idx} className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    className="w-full rounded-lg bg-blue-600 py-3 px-4 font-semibold text-white transition-colors hover:bg-blue-700 mt-4"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default FlashCard;