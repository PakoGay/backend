import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import ParentDashboard from '@/features/parent/ParentDashboard';
import ChildSelect from '@/features/child/ChildSelect';
import CurriculumMap from '@/features/child/CurriculumMap';
import LessonScreen from '@/features/child/LessonScreen';
import AdminPanel from '@/features/admin/AdminPanel';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/parent/dashboard',
    element: <ProtectedRoute><ParentDashboard /></ProtectedRoute>,
  },
  {
    path: '/learn',
    element: <ProtectedRoute><ChildSelect /></ProtectedRoute>,
  },
  {
    path: '/learn/map',
    element: <ProtectedRoute><CurriculumMap /></ProtectedRoute>,
  },
  {
    path: '/learn/lesson/:lessonId',
    element: <ProtectedRoute><LessonScreen /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <div className="p-10 text-center text-2xl">Страница не найдена</div>,
  },
]);