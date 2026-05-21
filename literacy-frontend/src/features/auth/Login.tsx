import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiClient from '@/app/api/client';
import { useAuthStore } from '@/app/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { 
        email, 
        password 
      });

      const { accessToken, refreshToken, user } = response.data;

      login(user, accessToken, refreshToken);

      toast.success('Успешный вход! 👋');

      // Перенаправление в зависимости от роли
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'PARENT') {
        navigate('/parent/dashboard');
      } else {
        navigate('/learn');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Грамотный Малыш
          </CardTitle>
          <CardDescription className="text-lg">
            Войдите в аккаунт родителя
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Входим...' : 'Войти'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}