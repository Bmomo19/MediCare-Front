'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi, logoutApi } from '@/api/api';
import { User, AuthContextType, LoginApiResponse } from '../types/auth';

// Crée le contexte avec un type par défaut null ou le type AuthContextType
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // Charge l'utilisateur et le token depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur stockées :", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      setLoading(true);
      const data: LoginApiResponse = await loginApi(identifier, password);

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) { 
      console.error("Erreur de connexion:", error);
      return { success: false, message: error.message || "Une erreur est survenue lors de la connexion." };
    } finally {
      setLoading(false);
    }
  }, [router]);
 
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await logoutApi();
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      router.push('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const authContextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};