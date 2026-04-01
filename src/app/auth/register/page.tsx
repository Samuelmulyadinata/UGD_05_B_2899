'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper'; 
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateRandomCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  
  const [captchaText, setCaptchaText] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  useEffect(() => {
    setCaptchaText(generateRandomCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateRandomCaptcha());
  };

  const strength = Math.min(
    (password.length > 7 ? 25 : 0) +
    (/[A-Z]/.test(password) ? 25 : 0) +
    (/[0-9]/.test(password) ? 25 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
  );

  const confirmStrength = Math.min(
    (confirmPassword.length > 7 ? 25 : 0) +
    (/[A-Z]/.test(confirmPassword) ? 25 : 0) +
    (/[0-9]/.test(confirmPassword) ? 25 : 0) +
    (/[^A-Za-z0-9]/.test(confirmPassword) ? 25 : 0)
  );

  const onSubmit = (data: RegisterFormData) => {
    toast.success('Register Berhasil!', { theme: 'dark', position: 'top-right'});
    router.push('/auth/login');
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username <span className="text-gray-500 text-xs">(max 8 karakter)</span>
          </label>
          <input
            id="username"
            {...register('username', { 
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              maxLength: { value: 8, message: 'Maksimal 8 karakter' }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan username"
          />
          {errors.username && <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email wajib diisi',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/,
                message: 'Format email tidak valid'
              }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            id="nomorTelp"
            type="tel"
            {...register('nomorTelp', { 
              required: 'Nomor telepon wajib diisi',
              minLength: { value: 10, message: 'Nomor telepon minimal 10 karakter' },
              pattern: { value: /^[0-9]+$/, message: 'Hanya boleh berisi angka' }
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
            }}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorTelp && <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { 
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Password minimal 8 karakter' }
              })}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {password.length > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-yellow-500' : strength <= 75 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Strength: {strength}%</p>
            </div>
          )}

          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', { 
                required: 'Konfirmasi password wajib diisi',
                validate: value => value === password || 'Konfirmasi password tidak cocok'
              })}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    confirmStrength <= 25 ? 'bg-red-500' : confirmStrength <= 50 ? 'bg-yellow-500' : confirmStrength <= 75 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${confirmStrength}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Strength: {confirmStrength}%</p>
            </div>
          )}

          {errors.confirmPassword && <p className="text-red-600 text-sm italic mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
              {captchaText}
            </span>
            <button 
              type="button" 
              onClick={handleRefreshCaptcha} 
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FaSyncAlt />
            </button>
          </div>
          <input
            type="text"
            {...register('captcha', { 
              required: 'Harus sesuai dengan captcha yang ditampilkan',
              validate: value => value === captchaText || 'Harus sesuai dengan captcha yang ditampilkan'
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
          Register
        </button>

        <SocialAuth />
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
      </p>
    </AuthFormWrapper>
  );
};

export default RegisterPage;