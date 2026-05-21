import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle, Play } from 'lucide-react';

const units = [
  {
    id: 1,
    title: 'Буквы и звуки',
    emoji: '🔤',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    lessons: [
      { id: 1, title: 'Гласные буквы', status: 'completed', stars: 3 },
      { id: 2, title: 'Согласные буквы', status: 'completed', stars: 2 },
      { id: 3, title: 'Звуки и буквы', status: 'active', stars: 0 },
      { id: 4, title: 'Мягкие знаки', status: 'locked', stars: 0 },
      { id: 5, title: 'Твёрдые знаки', status: 'locked', stars: 0 },
    ],
  },
  {
    id: 2,
    title: 'Слоги',
    emoji: '📝',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    lessons: [
      { id: 6, title: 'Что такое слог?', status: 'locked', stars: 0 },
      { id: 7, title: 'Деление на слоги', status: 'locked', stars: 0 },
      { id: 8, title: 'Ударение', status: 'locked', stars: 0 },
      { id: 9, title: 'Слоги-слияния', status: 'locked', stars: 0 },
    ],
  },
  {
    id: 3,
    title: 'Первые слова',
    emoji: '💬',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    lessons: [
      { id: 10, title: 'Короткие слова', status: 'locked', stars: 0 },
      { id: 11, title: 'Животные', status: 'locked', stars: 0 },
      { id: 12, title: 'Цвета', status: 'locked', stars: 0 },
      { id: 13, title: 'Цифры', status: 'locked', stars: 0 },
      { id: 14, title: 'Семья', status: 'locked', stars: 0 },
    ],
  },
  {
    id: 4,
    title: 'Чтение предложений',
    emoji: '📖',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    lessons: [
      { id: 15, title: 'Простые предложения', status: 'locked', stars: 0 },
      { id: 16, title: 'Вопросы', status: 'locked', stars: 0 },
      { id: 17, title: 'Рассказы', status: 'locked', stars: 0 },
    ],
  },
];

export default function CurriculumMap() {
  const navigate = useNavigate();
  const [expandedUnit, setExpandedUnit] = useState<number>(1);

  const totalCompleted = units.flatMap(u => u.lessons).filter(l => l.status === 'completed').length;
  const totalLessons = units.flatMap(u => u.lessons).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/learn')}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
          >
            ← Сменить профиль
          </button>
          <h1 className="font-black text-lg text-indigo-700">Грамотный Малыш</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-orange-500">🔥</span>
            <span className="font-bold text-orange-600">7</span>
            <span className="text-yellow-500 ml-2">⭐</span>
            <span className="font-bold text-yellow-600">1240</span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Общий прогресс</span>
            <span>{totalCompleted}/{totalLessons} уроков</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / totalLessons) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {units.map((unit, unitIndex) => {
          const completedInUnit = unit.lessons.filter(l => l.status === 'completed').length;
          const isExpanded = expandedUnit === unit.id;
          const isLocked = unit.lessons.every(l => l.status === 'locked');

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.1 }}
              className={`rounded-2xl border-2 overflow-hidden ${unit.borderColor} ${isLocked ? 'opacity-60' : ''}`}
            >
              {/* Unit Header */}
              <button
                onClick={() => !isLocked && setExpandedUnit(isExpanded ? 0 : unit.id)}
                className={`w-full ${unit.bgColor} p-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-2xl shadow-md`}>
                    {isLocked ? '🔒' : unit.emoji}
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-gray-800">{unit.title}</h2>
                    <p className="text-xs text-gray-500">{completedInUnit}/{unit.lessons.length} уроков</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini progress */}
                  <div className="w-16 h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${unit.color} rounded-full`}
                      style={{ width: `${(completedInUnit / unit.lessons.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-lg">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="bg-white p-4 space-y-3">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lessonIndex * 0.05 }}
                    >
                      <button
                        disabled={lesson.status === 'locked'}
                        onClick={() => lesson.status !== 'locked' && navigate(`/learn/lesson/${lesson.id}`)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all
                          ${lesson.status === 'completed' ? 'bg-green-50 hover:bg-green-100' : ''}
                          ${lesson.status === 'active' ? 'bg-indigo-50 hover:bg-indigo-100 ring-2 ring-indigo-300' : ''}
                          ${lesson.status === 'locked' ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                          ${lesson.status === 'completed' ? 'bg-green-400' : ''}
                          ${lesson.status === 'active' ? 'bg-indigo-500' : ''}
                          ${lesson.status === 'locked' ? 'bg-gray-200' : ''}
                        `}>
                          {lesson.status === 'completed' && <CheckCircle className="h-5 w-5 text-white" />}
                          {lesson.status === 'active' && <Play className="h-5 w-5 text-white" />}
                          {lesson.status === 'locked' && <Lock className="h-5 w-5 text-gray-400" />}
                        </div>

                        {/* Title */}
                        <div className="flex-1 text-left">
                          <p className={`font-bold text-sm
                            ${lesson.status === 'completed' ? 'text-green-700' : ''}
                            ${lesson.status === 'active' ? 'text-indigo-700' : ''}
                            ${lesson.status === 'locked' ? 'text-gray-400' : ''}
                          `}>
                            {lesson.title}
                          </p>
                          {lesson.status === 'active' && (
                            <p className="text-xs text-indigo-400">Продолжить →</p>
                          )}
                        </div>

                        {/* Stars */}
                        {lesson.status === 'completed' && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(i => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i <= lesson.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}