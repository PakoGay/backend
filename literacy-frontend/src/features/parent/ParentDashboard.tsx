import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { LogOut, BookOpen, Star, Trophy, TrendingUp, Clock, ChevronRight, Plus, Bell } from 'lucide-react';
import apiClient from '@/app/api/client';
import { toast } from 'sonner';

interface Child {
  id: number;
  name: string;
  age: number;
  avatar: string;
  currentLevel: number;
  xp: number;
  dailyStreak: number;
  progressPercent: number;
}

const AVATAR_MAP: Record<string, string> = {
  'boy': '👦', 'girl': '👧', 'cat': '🐱', 'dog': '🐶',
  'rabbit': '🐰', 'bear': '🐻', 'fox': '🦊', 'owl': '🦉',
};

function getAvatar(avatar: string) {
  return AVATAR_MAP[avatar] || avatar || '👤';
}

export default function ParentDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', age: 5, avatar: 'boy', startingLevel: 1 });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await apiClient.get('/children');
      setChildren(response.data.content || []);
    } catch {
      toast.error('Не удалось загрузить данные детей');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/children', newChild);
      toast.success('Ребёнок добавлен!');
      setShowAddChild(false);
      setNewChild({ name: '', age: 5, avatar: 'boy', startingLevel: 1 });
      fetchChildren();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при добавлении');
    }
  };

  const totalXp = children.reduce((sum, c) => sum + c.xp, 0);
  const avgStreak = children.length > 0 ? Math.round(children.reduce((sum, c) => sum + c.dailyStreak, 0) / children.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">Грамотный Малыш</h1>
            <p className="text-sm text-gray-500">Добро пожаловать, {user?.name ?? 'Родитель'} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Всего XP', value: totalXp, icon: <Star className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-600' },
            { label: 'Средний streak', value: `${avgStreak} дней`, icon: <TrendingUp className="h-5 w-5 text-orange-500" />, color: 'text-orange-600' },
            { label: 'Всего детей', value: children.length, icon: <Trophy className="h-5 w-5 text-purple-500" />, color: 'text-purple-600' },
            { label: 'Активны сегодня', value: children.filter(c => c.dailyStreak > 0).length, icon: <Clock className="h-5 w-5 text-blue-500" />, color: 'text-blue-600' },
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

        {/* Children */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Мои дети</h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() => setShowAddChild(!showAddChild)}
            >
              <Plus className="h-4 w-4" />
              Добавить ребёнка
            </Button>
          </div>

          {/* Add Child Form */}
          {showAddChild && (
            <Card className="border-2 border-indigo-200 mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleAddChild} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Имя</label>
                      <input
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Имя ребёнка"
                        value={newChild.name}
                        onChange={e => setNewChild({...newChild, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Возраст (3-8)</label>
                      <input
                        type="number"
                        min={3} max={8}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={newChild.age}
                        onChange={e => setNewChild({...newChild, age: Number(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Аватар</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={newChild.avatar}
                        onChange={e => setNewChild({...newChild, avatar: e.target.value})}
                      >
                        <option value="boy">👦 Мальчик</option>
                        <option value="girl">👧 Девочка</option>
                        <option value="cat">🐱 Кот</option>
                        <option value="rabbit">🐰 Кролик</option>
                        <option value="bear">🐻 Медведь</option>
                        <option value="fox">🦊 Лиса</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Начальный уровень (1-20)</label>
                      <input
                        type="number"
                        min={1} max={20}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={newChild.startingLevel}
                        onChange={e => setNewChild({...newChild, startingLevel: Number(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Добавить</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddChild(false)}>Отмена</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-400">Загрузка...</div>
          ) : children.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Детей пока нет</p>
              <p className="text-sm mt-1">Добавьте первого ребёнка чтобы начать</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {children.map((child) => (
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
                        <div className="text-5xl">{getAvatar(child.avatar)}</div>
                        <div>
                          <CardTitle className="text-xl">{child.name}</CardTitle>
                          <p className="text-sm text-gray-500">{child.age} лет • Уровень {child.currentLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                        <span className="text-orange-500">🔥</span>
                        <span className="text-sm font-bold text-orange-600">{child.dailyStreak}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>⭐ {child.xp} XP</span>
                        <span>{child.progressPercent}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                          style={{ width: `${child.progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm text-indigo-700 font-medium">Уровень {child.currentLevel}</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="gap-1 bg-indigo-600 hover:bg-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.setItem('selectedChildId', String(child.id));
                          navigate('/learn');
                        }}
                      >
                        Перейти
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}