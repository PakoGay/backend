import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiClient from '@/app/api/client';
import { useAuthStore } from '@/app/store/authStore';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { 
        email, 
        password 
      });

      const { token, user } = response.data;

      // Сохраняем через Zustand
      useAuthStore.getState().login(user, token);

      toast.success('Добро пожаловать!');

      // Перенаправление в зависимости от роли
      if (user?.role?.toUpperCase() === 'PARENT') {
        navigate('/parent/dashboard');
      } else if (user?.role?.toUpperCase() === 'CHILD') {
        navigate('/learn');
      } else {
        navigate('/parent/dashboard');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Неверный email или пароль'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-3 pb-8">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Грамотный Малыш
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Платформа для развития грамотности детей
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}