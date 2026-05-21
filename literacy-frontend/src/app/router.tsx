import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';   // создадим позже если нет

// Parent
import ParentDashboard from '@/features/parent/ParentDashboard';

// Child
// import ChildSelector from '@/features/child/ChildSelector';
// import CurriculumMap from '@/features/child/CurriculumMap';
// import LessonScreen from '@/features/child/LessonScreen';

// Admin
// import AdminDashboard from '@/features/admin/AdminDashboard';

import { useAuthStore } from '@/app/store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/parent/dashboard" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/parent/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['PARENT']}>
        <ParentDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/learn",
    element: (
      <ProtectedRoute allowedRoles={['PARENT', 'CHILD']}>
        {/* <ChildSelector /> */}
        <div>Child Learning Interface (в разработке)</div>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div>Admin Panel (в разработке)</div>
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: <div>404 — Страница не найдена</div>,
  },
]);