/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient'; // Importez votre client API configuré
import axios from 'axios'; // Importez axios pour vérifier les erreurs Axios
import { User, LoginApiResponse, AuthContextType, UserSession } from '@/types/auth'; // Importez vos types
import * as Constante from '@/lib/constant'; // Importez vos constantes

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null); // Maintenu pour le type, mais non utilisé pour refresh explicite
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // Fonction pour charger les tokens et l'utilisateur depuis localStorage
  const loadAuthData = useCallback(() => {
    const storedAccessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;

    if (storedAccessToken && storedUser) { // Le refresh token n'est pas obligatoire pour l'initialisation ici
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
        setRefreshToken(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common['Authorization']; // Supprimer le header si pas de token
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAuthData(); // Charger les données d'auth au montage
  }, [loadAuthData]);

  
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      // Tente de récupérer l'utilisateur authentifié.
      const response = await apiClient.get<UserSession>(Constante.ENDPOINTS.USER);

      setUser(response.data.user);
      setAccessToken(response.data.session_info.new_token);
      localStorage.setItem('accessToken', response.data.session_info.new_token);
      // Mettre à jour le header Authorization par défaut pour apiClient
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.session_info.new_token}`;

      setIsAuthenticated(true);
    } catch (error) {
      console.log("Aucune session active ou erreur de récupération de l'utilisateur:", error);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      delete apiClient.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!user) {
    checkAuthStatus();
  } else {
    setLoading(false);
  }
  }, [checkAuthStatus, user]);


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

        setUser(loggedInUser);
        setAccessToken(access_token);
        setIsAuthenticated(true);

        // Stockage dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', access_token);
          
          // Stocke l'objet user sans l'objet accessToken imbriqué pour la simplicité
          const userToStore = { ...loggedInUser };
          delete (userToStore as any).accessToken; // Supprime la propriété accessToken avant de stocker
          localStorage.setItem('authUser', JSON.stringify(userToStore));
        }

        // Mettre à jour le header Authorization par défaut pour apiClient
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
      setRefreshToken(null);
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

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    accessToken,
    refreshToken,
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
