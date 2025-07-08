import { Role } from "@/lib/enum";

// User interface
export interface User {
  id: string;
  fullname: string;
  email: string;
  username: string;
  role: Role; // Exemple de rôles
}

// Interface pour la réponse de l'API de connexion réussie
export interface LoginSuccessResponse {
  success: true;
  user: User;
  token: string;
}

type LoginResponse = {
  message: string;
  user: User;
  // token?: string; // Laravel Sanctum pour SPA ne renvoie PAS de token d'accès dans la réponse de login par défaut.
}

// Interface pour la réponse de l'API de connexion échouée
export interface LoginFailureResponse {
  success: false;
  message: string;
}

// Type union pour toutes les réponses de connexion possibles
export type LoginApiResponse = LoginSuccessResponse | LoginFailureResponse;


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}