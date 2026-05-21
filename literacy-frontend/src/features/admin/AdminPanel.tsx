import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/authStore';
import {
  Users, BookOpen, BarChart3, LogOut,
  Plus, Trash2, Edit, ChevronDown, ChevronUp,
  GraduationCap, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Tab = 'dashboard' | 'users' | 'curriculum';

const mockUsers = [
  { id: 1, name: 'Абушахман', email: 'abu@gmail.com', role: 'PARENT', children: 2, joined: '12.03.2025' },
  { id: 2, name: 'Динара', email: 'dinara@gmail.com', role: 'PARENT', children: 1, joined: '05.04.2025' },
  { id: 3, name: 'Баука', email: '', role: 'CHILD', children: 0, joined: '12.03.2025' },
  { id: 4, name: 'Ерлан', email: '', role: 'CHILD', children: 0, joined: '12.03.2025' },
  { id: 5, name: 'Admin', email: 'admin@literacy.kz', role: 'ADMIN', children: 0, joined: '01.01.2025' },
];

const mockUnits = [
  {
    id: 1, title: 'Буквы и звуки', emoji: '🔤', lessonsCount: 5,
    lessons: [
      { id: 1, title: 'Гласные буквы', exercises: 8 },
      { id: 2, title: 'Согласные буквы', exercises: 10 },
      { id: 3, title: 'Звуки и буквы', exercises: 7 },
      { id: 4, title: 'Мягкие знаки', exercises: 6 },
      { id: 5, title: 'Твёрдые знаки', exercises: 6 },
    ]
  },
  {
    id: 2, title: 'Слоги', emoji: '📝', lessonsCount: 4,
    lessons: [
      { id: 6, title: 'Что такое слог?', exercises: 5 },
      { id: 7, title: 'Деление на слоги', exercises: 8 },
      { id: 8, title: 'Ударение', exercises: 7 },
      { id: 9, title: 'Слоги-слияния', exercises: 9 },
    ]
  },
  {
    id: 3, title: 'Первые слова', emoji: '💬', lessonsCount: 5,
    lessons: [
      { id: 10, title: 'Короткие слова', exercises: 10 },
      { id: 11, title: 'Животные', exercises: 12 },
      { id: 12, title: 'Цвета', exercises: 8 },
      { id: 13, title: 'Цифры', exercises: 10 },
      { id: 14, title: 'Семья', exercises: 7 },
    ]
  },
];

const mockStats = {
  totalUsers: 5,
  totalParents: 2,
  totalChildren: 2,
  totalUnits: 4,
  totalLessons: 17,
  totalExercises: 89,
  activeToday: 3,
};

export default function AdminPanel() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [userFilter, setUserFilter] = useState<'ALL' | 'PARENT' | 'CHILD' | 'ADMIN'>('ALL');

  const filteredUsers = userFilter === 'ALL'
    ? mockUsers
    : mockUsers.filter(u => u.role === userFilter);

  const tabs = [
    { id: 'dashboard', label: 'Обзор', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'Пользователи', icon: <Users className="h-4 w-4" /> },
    { id: 'curriculum', label: 'Curriculum', icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-800 text-sm">Admin Panel</h1>
              <p className="text-xs text-gray-400">Грамотный Малыш</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate('/parent/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <GraduationCap className="h-4 w-4" />
            Кабинет родителя
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Обзор системы</h2>
              <p className="text-gray-500 text-sm mt-1">Статистика платформы в реальном времени</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Всего пользователей', value: mockStats.totalUsers, icon: '👥', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Родителей', value: mockStats.totalParents, icon: '👨‍👩‍👧', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Детей', value: mockStats.totalChildren, icon: '👦', color: 'text-pink-600', bg: 'bg-pink-50' },
                { label: 'Активны сегодня', value: mockStats.activeToday, icon: '🟢', color: 'text-green-600', bg: 'bg-green-50' },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="pt-5 pb-4">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                      {stat.icon}
                    </div>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Разделов (Units)', value: mockStats.totalUnits, icon: '📚' },
                { label: 'Уроков', value: mockStats.totalLessons, icon: '📖' },
                { label: 'Заданий', value: mockStats.totalExercises, icon: '✏️' },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="pt-5 pb-4 flex items-center gap-4">
                    <span className="text-4xl">{stat.icon}</span>
                    <div>
                      <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Пользователи</h2>
                <p className="text-gray-500 text-sm mt-1">{filteredUsers.length} пользователей</p>
              </div>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                Добавить
              </Button>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {(['ALL', 'PARENT', 'CHILD', 'ADMIN'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setUserFilter(role)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                    ${userFilter === role
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  {role === 'ALL' ? 'Все' : role === 'PARENT' ? 'Родители' : role === 'CHILD' ? 'Дети' : 'Админы'}
                </button>
              ))}
            </div>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Имя</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Роль</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Дата</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                            {user.name[0]}
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold
                          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : ''}
                          ${user.role === 'PARENT' ? 'bg-blue-100 text-blue-700' : ''}
                          ${user.role === 'CHILD' ? 'bg-pink-100 text-pink-700' : ''}
                        `}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{user.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* CURRICULUM TAB */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Учебная программа</h2>
                <p className="text-gray-500 text-sm mt-1">{mockUnits.length} разделов</p>
              </div>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                Добавить раздел
              </Button>
            </div>

            <div className="space-y-3">
              {mockUnits.map(unit => (
                <Card key={unit.id} className="border-0 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{unit.emoji}</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">{unit.title}</p>
                        <p className="text-xs text-gray-400">{unit.lessonsCount} уроков</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expandedUnit === unit.id
                        ? <ChevronUp className="h-4 w-4 text-gray-400" />
                        : <ChevronDown className="h-4 w-4 text-gray-400" />
                      }
                    </div>
                  </button>

                  {expandedUnit === unit.id && (
                    <div className="border-t border-gray-100">
                      <div className="px-6 py-3 flex justify-between items-center bg-gray-50">
                        <span className="text-xs font-bold text-gray-500 uppercase">Уроки</span>
                        <button className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800">
                          <Plus className="h-3 w-3" />
                          Добавить урок
                        </button>
                      </div>
                      {unit.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="px-6 py-3 flex items-center justify-between border-t border-gray-50 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                              {lesson.id}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">{lesson.exercises} заданий</span>
                            <button className="p-1 text-gray-400 hover:text-indigo-600 rounded">
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}