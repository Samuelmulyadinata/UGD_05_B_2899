'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  remberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateRandomCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  
  const [attempts, setAttempts] = useState<number>(3);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [captchaText, setCaptchaText] = useState<string>(generateRandomCaptcha());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateRandomCaptcha());
  };

  const handleResetKesempatan = () => {
    setAttempts(3);
    setErrors({});
    toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attempts <= 0) return;

    const newErrors: ErrorObject = {};
    let isError = false;

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
      isError = true;
    } else if (formData.email !== '2899@gmail.com') {
      newErrors.email = 'Email harus sesuai dengan format npm kalian (cth. 2899@gmail.com)';
      isError = true;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
      isError = true;
    } else if (formData.password !== '241712899') {
      newErrors.password = 'Password harus sesuai dengan format npm kalian (cth. 241712899)';
      isError = true;
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
      isError = true;
    } else if (formData.captchaInput !== captchaText) {
      newErrors.captcha = 'Captcha tidak valid';
      isError = true;
    }

    if (isError) {
      setErrors(newErrors);
      const nextAttempts = attempts - 1;
      setAttempts(nextAttempts);

      if (nextAttempts === 0) {
        toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      } else {
        toast.error(`Login Gagal! Sisa kesempatan: ${nextAttempts}`, { theme: 'dark', position: 'top-right' });
      }
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/home');
  };

  return (
    <AuthFormWrapper title="Login">
      <p className="text-sm font-semibold text-gray-700 text-center">Sisa Kesempatan: {attempts}</p>
      
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={attempts === 0}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} ${attempts === 0 ? 'bg-gray-100' : ''}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={attempts === 0}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} ${attempts === 0 ? 'bg-gray-100' : ''}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={attempts === 0}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="remberMe"
                checked={formData.remberMe || false}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, remberMe: e.target.checked }))
                }
                disabled={attempts === 0}
                className="mr-2 rounded border-gray-300"
              />
              Ingat Saya
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
              Forgot Password?
            </Link>
          </div>
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
              disabled={attempts === 0}
              className="text-blue-600 hover:text-blue-800 transition-colors font-bold text-lg"
            >
              <FaSyncAlt size={14} />
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            disabled={attempts === 0}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'} ${attempts === 0 ? 'bg-gray-100' : ''}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={attempts === 0}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${attempts === 0 ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
          >
            Sign In
          </button>

          <button
            type="button"
            disabled={attempts > 0}
            onClick={handleResetKesempatan}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${attempts === 0 ? 'bg-[#10a342] hover:bg-green-700 text-white shadow-sm' : 'bg-gray-400 text-gray-100 cursor-not-allowed'}`}
          >
            Reset Kesempatan
          </button>
        </div>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default LoginPage;