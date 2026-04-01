'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 w-full">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          <img 
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWg5djlwMGExNWczd2ptZGRpZ3EybzR4dWk2Zno5cHBjbThlNGVoaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif" 
            alt="Not Authorized" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-red-500">❌</span> Anda belum login
        </h2>
        <p className="text-gray-500 text-sm mb-6">Silakan login terlebih dahulu.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md transition-all"
        >
          ⬅ Kembali
        </button>
      </div>
    </div>
  );
}