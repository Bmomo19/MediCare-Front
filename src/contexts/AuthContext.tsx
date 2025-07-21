// contexts/AuthContext.tsx
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null); // Maintenu pour le type, mais non utilisé pour refresh explicite
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // Fonction pour charger les tokens et l'utilisateur depuis sessionStorage
  const loadAuthData = useCallback(() => {
    const storedAccessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    const storedRefreshToken = typeof window !== 'undefined' ? sessionStorage.getItem('refreshToken') : null; // Charge le refresh token s'il existe
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('authUser') : null;

    if (storedAccessToken && storedUser) { // Le refresh token n'est pas obligatoire pour l'initialisation ici
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken); // Assigne le refresh token
        setIsAuthenticated(true);
        // Mettre à jour le header Authorization par défaut pour apiClient
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur stockées :", error);
        // Nettoyer si les données sont corrompues
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('authUser');
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

  // Vérifie l'état d'authentification en appelant /user
  // Utile lors de l'initialisation ou après un rafraîchissement de page
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      // Tente de récupérer l'utilisateur authentifié.
      // Si l'access token est valide, Laravel renverra l'utilisateur.
      const response = await apiClient.get<User>(Constante.ENDPOINTS.USER);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Aucune session active ou erreur de récupération de l'utilisateur:", error);
      // Si le /user endpoint échoue (ex: 401), l'intercepteur va gérer la déconnexion.
      // Donc ici, nous n'avons qu'à nettoyer l'état local.
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authUser');
      delete apiClient.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  // Appeler checkAuthStatus au montage pour valider le token existant
  useEffect(() => {
    // Si un access token est présent, on vérifie l'état avec l'API.
    // Sinon, on considère que l'utilisateur n'est pas authentifié et on arrête le chargement.
    if (accessToken) {
       checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [accessToken, checkAuthStatus]);


  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      // apiClient.post gérera déjà l'obtention du CSRF cookie
      const response = await apiClient.post<LoginApiResponse>(
        Constante.ENDPOINTS.LOGIN,
        credentials
      );

      if (response.status === 200) {
        // Extraction des données selon la structure de votre API
        const loggedInUser = response.data.user;
        const access_token = loggedInUser.accessToken.access_token;
        const refresh_token = response.data.refresh_token || null; // Capture le refresh_token s'il est fourni

        setUser(loggedInUser);
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setIsAuthenticated(true);

        // Stockage dans sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('accessToken', access_token);
          if (refresh_token) { // Stocke le refresh token seulement s'il est fourni
            sessionStorage.setItem('refreshToken', refresh_token);
          }
          // Stocke l'objet user sans l'objet accessToken imbriqué pour la simplicité
          const userToStore = { ...loggedInUser };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (userToStore as any).accessToken; // Supprime la propriété accessToken avant de stocker
          sessionStorage.setItem('authUser', JSON.stringify(userToStore));
        }

        // Mettre à jour le header Authorization par défaut pour apiClient
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

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
      // Tente d'appeler l'endpoint de déconnexion.
      // Le backend devrait invalider le refresh token et l'access token.
      await apiClient.post(Constante.ENDPOINTS.LOGOUT);
    } catch (error) {
      // Si c'est une erreur Axios et que le statut est 401,
      // cela signifie probablement que le token était déjà invalide.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Déconnexion : Token déjà invalide (401). Traitement comme déconnexion réussie côté client.");
      } else {
        console.error("Erreur de déconnexion inattendue:", error);
      }
    } finally {
      // Dans tous les cas, nettoyez l'état local et redirigez.
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common['Authorization']; // Supprimer le header

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('authUser');
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
