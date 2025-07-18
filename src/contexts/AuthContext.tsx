'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient';
import { AuthContextType, LoginResponse, User } from '@/types/auth';
import * as Constante from '@/lib/constant';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Tente de récupérer l'utilisateur authentifié
        const response = await apiClient.get<User>('/user');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Aucune session active ou erreur de récupération de l'utilisateur:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setLoading(true);

      // Call the login API
      const response = await apiClient.post<LoginResponse>(
        // Constante.BASE_ENDPOINTS +
        Constante.ENDPOINTS.LOGIN, 
        credentials
      );

      if (response.status === 200) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        // Stockage des informations utilisateur
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(loggedInUser));
        }
        
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Échec de la connexion.' };
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur de connexion:", error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Une erreur est survenue lors de la connexion." 
      };
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiClient.post(Constante.BASE_ENDPOINTS + Constante.ENDPOINTS.LOGOUT);
      setUser(null);
      setIsAuthenticated(false);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
      
      router.push('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Même en cas d'erreur, nettoyer l'état local
      setUser(null);
      setIsAuthenticated(false);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
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
