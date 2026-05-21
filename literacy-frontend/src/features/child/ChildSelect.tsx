import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const mockChildren = [
  { id: 1, name: 'Айша', age: 6, avatar: '👧', color: 'from-pink-400 to-rose-400', level: 3, streak: 7 },
  { id: 2, name: 'Ерлан', age: 8, avatar: '👦', color: 'from-blue-400 to-indigo-400', level: 5, streak: 12 },
];

export default function ChildSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelected(id);
    setTimeout(() => {
      navigate(`/learn/map`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center p-6">
      
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-20 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl font-black text-white drop-shadow-lg mb-3">
          Привет! 👋
        </h1>
        <p className="text-xl text-white/80 font-medium">
          Кто будет учиться сегодня?
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-8 justify-center relative z-10">
        {mockChildren.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(child.id)}
            className={`cursor-pointer rounded-3xl p-1 bg-gradient-to-br ${child.color} shadow-2xl
              ${selected === child.id ? 'ring-4 ring-white ring-offset-4 ring-offset-transparent' : ''}
            `}
          >
            <div className="bg-white rounded-[20px] p-8 w-52 text-center space-y-4">
              
              {/* Avatar */}
              <motion.div
                animate={selected === child.id ? { rotate: [0, -10, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-8xl leading-none"
              >
                {child.avatar}
              </motion.div>

              {/* Name */}
              <div>
                <h2 className="text-2xl font-black text-gray-800">{child.name}</h2>
                <p className="text-gray-400 text-sm">{child.age} лет</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-indigo-600">{child.level}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Уровень</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-500">🔥{child.streak}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Streak</p>
                </div>
              </div>

              {/* Button */}
              <div className={`bg-gradient-to-r ${child.color} text-white rounded-xl py-2 px-4 text-sm font-bold`}>
                {selected === child.id ? '✨ Загружаем...' : 'Играть!'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/parent/dashboard')}
        className="mt-12 text-white/70 hover:text-white text-sm underline relative z-10 transition-colors"
      >
        ← Вернуться в кабинет родителя
      </motion.button>
    </div>
  );
}