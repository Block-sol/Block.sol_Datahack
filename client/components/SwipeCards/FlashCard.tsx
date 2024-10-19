import { CardProps } from './index';
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useState } from 'react';

const FlashCard = ({ data, active, removeCard }: CardProps) => {
  const [exitX, setExitX] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);

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

  const handleOptionSelect = (index: number) => {
    if (!flipped) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setFlipped(true);
      if (selectedOption === data.correctOption) {
        setTimeout(()=>{
          setExitX(200);
          removeCard(data.id, 'right');
        }, 1500)
          
      }else{
        setTimeout(() => {
          setExitX(-200);
          removeCard(data.id, 'left');
        }, 1500);
      }
    }
  };

  return (
    <>
      {active && (
        <motion.div
          drag={!flipped ? "x" : false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          className="card absolute z-30 w-[400px] h-[600px] self-center"
          onDragEnd={dragEnd}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1.05, opacity: 1 }}
          style={{ x, rotate, opacity }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeIn' }}
          whileDrag={{ cursor: 'grabbing' }}
          exit={{ x: exitX }}
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex h-full flex-col p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">{data.title}</h2>
              <p className="mb-6 text-xl font-medium text-gray-700">{data.question}</p>
              
              {!flipped ? (
                <div className="flex-grow space-y-4">
                  {data.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={`w-full rounded-lg py-3 px-4 text-left transition-colors ${
                        selectedOption === idx
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => handleOptionSelect(idx)}
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    className="mt-6 w-full rounded-lg bg-teal-600 py-3 px-4 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto">
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">Explanation:</h3>
                  <p className="text-gray-700">{data.explanation}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {data.topics.map((item, idx) => (
                  <span key={idx} className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FlashCard;