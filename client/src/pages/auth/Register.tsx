import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, UserPlus } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company: z.string().optional(),
  gstin: z.string().optional(),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerAuth(data);
      addToast('Enterprise account registered successfully!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      addToast(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Register Enterprise Account
          </h1>
          <p className="text-xs text-gray-500">
            Access bulk quotation terms & downloadable GST invoices
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
              required
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g. Rajesh Sharma"
            />
            <Input
              label="Work Email"
              type="email"
              required
              {...register('email')}
              error={errors.email?.message}
              placeholder="rajesh@apexelectricals.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              {...register('company')}
              error={errors.company?.message}
              placeholder="Apex Electricals & Hardware"
            />
            <Input
              label="Company GSTIN (Optional)"
              {...register('gstin')}
              error={errors.gstin?.message}
              placeholder="27BBBBB1111B1Z2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+91 91234 56789"
            />
            <Input
              label="Password"
              type="password"
              required
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-wider font-bold"
            isLoading={isLoading}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create B2B Account
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-industrial-800">
          Already registered?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
