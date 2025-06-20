// Interface pour les données de l'utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'staff'; // Exemple de rôles
}

// Interface pour la réponse de l'API de connexion réussie
export interface LoginSuccessResponse {
  success: true;
  user: User;
  token: string;
}

// Interface pour la réponse de l'API de connexion échouée
export interface LoginFailureResponse {
  success: false;
  message: string;
}

// Type union pour toutes les réponses de connexion possibles
export type LoginApiResponse = LoginSuccessResponse | LoginFailureResponse;

// Interface pour les fonctions de connexion dans le contexte
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}