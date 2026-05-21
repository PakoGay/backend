import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap } from 'lucide-react';

type Exercise = {
  id: number;
  type: 'choice' | 'match' | 'fill';
  question: string;
  emoji?: string;
  options?: string[];
  correct: string;
  hint?: string;
};

const mockExercises: Exercise[] = [
  {
    id: 1,
    type: 'choice',
    question: 'Какая из этих букв — гласная?',
    emoji: '🔤',
    options: ['Б', 'А', 'К', 'Т'],
    correct: 'А',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Выбери слово, которое начинается на букву «М»',
    emoji: '🐱',
    options: ['Собака', 'Рыба', 'Мяч', 'Кот'],
    correct: 'Мяч',
  },
  {
    id: 3,
    type: 'choice',
    question: 'Сколько гласных в слове «МАМА»?',
    emoji: '👩',
    options: ['1', '2', '3', '4'],
    correct: '2',
  },
  {
    id: 4,
    type: 'choice',
    question: 'Какая буква стоит первой в слове «АРБУЗ»?',
    emoji: '🍉',
    options: ['Р', 'У', 'А', 'Б'],
    correct: 'А',
  },
  {
    id: 5,
    type: 'choice',
    question: 'Какое слово короче?',
    emoji: '📏',
    options: ['Слон', 'Кот', 'Бегемот', 'Крокодил'],
    correct: 'Кот',
  },
];

const TOTAL_HEARTS = 3;

export default function LessonScreen() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [xp, setXp] = useState(0);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const exercise = mockExercises[currentIndex];
  const progress = ((currentIndex) / mockExercises.length) * 100;

  const handleSelect = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === exercise.correct;
    setIsCorrect(correct);
    if (correct) {
      setXp(prev => prev + 20);
      setCorrectCount(prev => prev + 1);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (hearts === 0) {
      navigate('/learn/map');
      return;
    }
    if (currentIndex + 1 >= mockExercises.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  // Finished screen
  if (finished) {
    const stars = correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-7xl"
          >
            🏆
          </motion.div>

          <div>
            <h1 className="text-3xl font-black text-gray-800">Урок завершён!</h1>
            <p className="text-gray-500 mt-1">Отличная работа!</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: i <= stars ? 1 : 0.6 }}
                transition={{ delay: 0.2 * i }}
                className={`text-5xl ${i <= stars ? 'opacity-100' : 'opacity-25'}`}
              >
                ⭐
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-yellow-600">+{xp}</p>
              <p className="text-xs text-yellow-500">XP заработано</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-green-600">{correctCount}/{mockExercises.length}</p>
              <p className="text-xs text-green-500">Правильных</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/learn/map')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity"
            >
              Продолжить →
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setIsCorrect(null);
                setHearts(TOTAL_HEARTS);
                setXp(0);
                setCorrectCount(0);
                setFinished(false);
              }}
              className="w-full text-gray-400 text-sm hover:text-gray-600 py-2"
            >
              Пройти ещё раз
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/learn/map')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
            />
          </div>

          {/* Hearts */}
          <div className="flex gap-1">
            {[...Array(TOTAL_HEARTS)].map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 ${i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 text-yellow-500">
            <Zap className="h-4 w-4 fill-yellow-400" />
            <span className="font-bold text-sm">{xp}</span>
          </div>
        </div>
      </div>

      {/* Exercise */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              {/* Question */}
              <div className="text-center space-y-3">
                {exercise.emoji && (
                  <div className="text-6xl">{exercise.emoji}</div>
                )}
                <h2 className="text-2xl font-black text-gray-800">
                  {exercise.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {exercise.options?.map((option) => {
                  let style = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50';
                  if (selected === option) {
                    style = isCorrect
                      ? 'bg-green-500 border-2 border-green-500 text-white'
                      : 'bg-red-500 border-2 border-red-500 text-white';
                  } else if (selected !== null && option === exercise.correct) {
                    style = 'bg-green-100 border-2 border-green-400 text-green-700';
                  }

                  return (
                    <motion.button
                      key={option}
                      whileHover={selected === null ? { scale: 1.03 } : {}}
                      whileTap={selected === null ? { scale: 0.97 } : {}}
                      onClick={() => handleSelect(option)}
                      className={`${style} rounded-2xl py-5 px-4 text-xl font-bold transition-all shadow-sm`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feedback + Next */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-black text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✅ Правильно!' : '❌ Неверно!'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-500 mt-1">
                        Правильный ответ: <span className="font-bold text-gray-700">{exercise.correct}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleNext}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90
                      ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    Далее →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}