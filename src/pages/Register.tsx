import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAppStore } from '../store/appStore';
import Header from '../components/Header';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const inputClass = 'w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 text-sm';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAppStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const result = registerUser(data.name, data.email, data.password);
    if (result.success) {
      toast.success('Account created! Welcome to SwiftCourier.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="flex items-center justify-center min-h-screen px-6 py-32">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-slate-900" />
                </div>
                <span className="font-heading text-2xl font-bold text-white">Swift<span className="text-amber-400">Courier</span></span>
              </Link>
              <h1 className="font-heading text-3xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-slate-400 text-sm">Start shipping with SwiftCourier today</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-white/10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input id="name" {...register('name')} className={inputClass} placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input id="email" type="email" {...register('email')} className={inputClass} placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input id="password" type="password" {...register('password')} className={inputClass} placeholder="••••••••" />
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input id="confirmPassword" type="password" {...register('confirmPassword')} className={inputClass} placeholder="••••••••" />
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Create Account
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-slate-400 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Register;