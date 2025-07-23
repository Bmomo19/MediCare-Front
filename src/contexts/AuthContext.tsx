/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient'; // Importez votre client API configuré
import axios from 'axios'; // Importez axios pour vérifier les erreurs Axios
import { User, LoginApiResponse, AuthContextType } from '@/types/auth'; // Importez vos types
import * as Constante from '@/lib/constant'; // Importez vos constantes

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiClient.post<LoginApiResponse>(
        Constante.ENDPOINTS.LOGIN,
        credentials
      );

      if (response.status === 200) {
        const loggedInUser = response.data.user;
        const access_token = loggedInUser.accessToken.access_token;

        localStorage.setItem('loginDate', new Date().toISOString().split('T')[0]);

        setUser(loggedInUser);
        setAccessToken(access_token);
        setIsAuthenticated(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', access_token);

          const userToStore = { ...loggedInUser };
          delete (userToStore as any).accessToken;
          localStorage.setItem('authUser', JSON.stringify(userToStore));
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Échec de la connexion.' };
      }
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
      await apiClient.post(Constante.ENDPOINTS.LOGOUT);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Déconnexion : Token déjà invalide (401). Traitement comme déconnexion réussie côté client.");
      } else {
        console.error("Erreur de déconnexion inattendue:", error);
      }
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common['Authorization'];

      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
      }
      setLoading(false);
      router.push('/login');
    }
  }, [router]);

  // Fonction pour charger les tokens et l'utilisateur depuis localStorage
  const loadAuthData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const storedAccessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    const storedLoginDate = typeof window !== 'undefined' ? localStorage.getItem('loginDate') : null;

    if (storedLoginDate && storedLoginDate !== today) {
      console.log("Connexion expirée : nouveau jour détecté");
      await logout();
      return;
    }

    if (storedAccessToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setAccessToken(storedAccessToken);
        setIsAuthenticated(true);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur stockées :", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
        await logout();
      }
    } else {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common['Authorization'];
      await logout();
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    accessToken,
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
