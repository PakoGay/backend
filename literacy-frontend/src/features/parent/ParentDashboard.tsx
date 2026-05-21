import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import {
  LogOut, BookOpen, Star, Trophy, TrendingUp,
  Clock, ChevronRight, Plus, Bell
} from 'lucide-react';

const mockChildren = [
  {
    id: 1,
    name: 'Айша',
    age: 6,
    avatar: '👧',
    level: 3,
    xp: 1240,
    xpToNext: 1500,
    streak: 7,
    lessonsCompleted: 24,
    totalLessons: 40,
    lastActive: '2 часа назад',
    currentUnit: 'Буквы и звуки',
    badges: ['⭐', '🔥', '📚'],
    weeklyProgress: [60, 80, 45, 90, 70, 85, 40],
  },
  {
    id: 2,
    name: 'Ерлан',
    age: 8,
    avatar: '👦',
    level: 5,
    xp: 2850,
    xpToNext: 3000,
    streak: 12,
    lessonsCompleted: 38,
    totalLessons: 40,
    lastActive: 'вчера',
    currentUnit: 'Чтение слов',
    badges: ['⭐', '🔥', '📚', '🏆', '💎'],
    weeklyProgress: [100, 90, 85, 95, 88, 92, 75],
  },
];

const mockStats = {
  totalXpThisWeek: 480,
  averageStreak: 9,
  totalBadges: 8,
  activeMinutesToday: 35,
};

export default function ParentDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">Грамотный Малыш</h1>
            <p className="text-sm text-gray-500">Добро пожаловать, {user?.name ?? 'Родитель'} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'XP за неделю', value: mockStats.totalXpThisWeek, icon: <Star className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-600' },
            { label: 'Средний streak', value: `${mockStats.averageStreak} дней`, icon: <TrendingUp className="h-5 w-5 text-orange-500" />, color: 'text-orange-600' },
            { label: 'Всего наград', value: mockStats.totalBadges, icon: <Trophy className="h-5 w-5 text-purple-500" />, color: 'text-purple-600' },
            { label: 'Минут сегодня', value: mockStats.activeMinutesToday, icon: <Clock className="h-5 w-5 text-blue-500" />, color: 'text-blue-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Children Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Мои дети</h2>
            <Button variant="outline" size="sm" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              <Plus className="h-4 w-4" />
              Добавить ребёнка
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mockChildren.map((child) => {
              const progressPercent = Math.round((child.xp / child.xpToNext) * 100);
              const lessonPercent = Math.round((child.lessonsCompleted / child.totalLessons) * 100);

              return (
                <Card
                  key={child.id}
                  className={`border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer ${
                    selectedChild === child.id ? 'ring-2 ring-indigo-400' : ''
                  }`}
                  onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-5xl">{child.avatar}</div>
                        <div>
                          <CardTitle className="text-xl">{child.name}</CardTitle>
                          <p className="text-sm text-gray-500">{child.age} лет • Уровень {child.level}</p>
                          <p className="text-xs text-gray-400 mt-1">Был(а) активен: {child.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                        <span className="text-orange-500">🔥</span>
                        <span className="text-sm font-bold text-orange-600">{child.streak}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>⭐ {child.xp} XP</span>
                        <span>{child.xpToNext} XP</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>📚 {child.lessonsCompleted} уроков</span>
                        <span>{lessonPercent}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all"
                          style={{ width: `${lessonPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Unit */}
                    <div className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm text-indigo-700 font-medium">{child.currentUnit}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {child.badges.map((badge, i) => (
                          <span key={i} className="text-xl">{badge}</span>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="gap-1 bg-indigo-600 hover:bg-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/learn');
                        }}
                      >
                        Перейти
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Weekly Progress Bar Chart */}
                    {selectedChild === child.id && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Активность за неделю</p>
                        <div className="flex items-end gap-1 h-16">
                          {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full bg-indigo-400 rounded-t-sm transition-all"
                                style={{ height: `${child.weeklyProgress[i]}%` }}
                              />
                              <span className="text-[10px] text-gray-400">{day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}