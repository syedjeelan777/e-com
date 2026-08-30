import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, ShieldCheck, LogIn, Key, UserCheck } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      addToast('Welcome back! Login successful.', 'success');
      if (data.email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (error: any) {
      addToast(error.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Sign In to <span className="text-brand-600 dark:text-brand-400">ShaziyaKart</span>
          </h1>
          <p className="text-xs text-gray-500">
            Enterprise procurement, order tracking & tax invoices
          </p>
        </div>

        {/* Demo Account Switcher Buttons */}
        <div className="bg-gray-50 dark:bg-industrial-950 p-3.5 rounded-2xl border border-gray-200 dark:border-industrial-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            <Key className="w-3.5 h-3.5 text-brand-500" /> One-Click Demo Accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@shaziyakart.local', 'Admin@12345')}
              className="bg-brand-900/40 hover:bg-brand-900 text-brand-300 border border-brand-700 font-bold py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@shaziyakart.local', 'Customer@12345')}
              className="bg-emerald-900/40 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Demo Customer
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="customer@shaziyakart.local"
          />

          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-wider font-bold"
            isLoading={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-industrial-800">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-bold underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
