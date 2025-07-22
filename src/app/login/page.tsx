'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const result = await login({ username, password });

    if (!result.success) {
      setError(result.message || "Une erreur inconnue est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Fond dégradé subtil avec un motif médical léger */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-green-100 opacity-80"></div>
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300" />
          <path d="M0 60 Q 20 40, 40 60 T 80 60 L 100 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-300" />
        </svg>
      </div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-10 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24">
            <Image src="/assets/logo.png" alt="Logo MediCare" className='w-full h-full' width={500} height={500} />
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-gray-900">
            Bienvenue sur MediCare
          </h3>
          <p className="mt-4 text-sm text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-700 bg-red-100 border border-red-400 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Identifiant / Email
            </label>
            <div className="mt-1">
              <input name="identifier" type="text" value={username} autoComplete="username" required placeholder="Votre identifiant ou email"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="mt-1">
              <input name="password" type="password" autoComplete="current-password" required placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out" />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                Mot de passe oublié ?
              </a>
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-150 ease-in-out
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-75' /* Styles grisés et désactivés */
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' /* Styles actifs */
                }
              `}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
            Contactez l&apos;administrateur
          </a>
        </p>
      </div>
    </div>
    // </>
  );
};

export default LoginPage;