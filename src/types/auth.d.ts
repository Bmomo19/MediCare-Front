// types/auth.ts
export interface User {
  id: number; // Ou string si votre ID est une chaîne
  medicalId: string;
  fullName: string;
  username: string;
  role: string;
  email: string;
  contact: string;
  isActif: boolean;
  isFirstConnection: boolean;
}

// Type pour l'objet accessToken imbriqué dans la réponse de login
export interface AccessTokenData {
  access_token: string;
  token_type: string;
  expires_at: string;
  expires_in_minutes: number;
  role: string;
  medicalId: string;
}

// La réponse complète de l'API de login
export interface LoginApiResponse {
  user: User & { accessToken: AccessTokenData }; // L'utilisateur contient l'objet accessToken imbriqué
  refresh_token?: string; // Optionnel: si votre API renvoie un refresh_token distinct
}

// Le type de réponse que notre fonction login renverra
export interface LoginResult {
  success: boolean;
  message?: string;
}

// Le type du contexte d'authentification
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (credentials: { username: string; password: string }) => Promise<LoginResult>;
  logout: () => Promise<void>;
}
