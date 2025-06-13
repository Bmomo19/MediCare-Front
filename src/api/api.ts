import { LoginApiResponse, LoginSuccessResponse, LoginFailureResponse } from '@/types/auth';

// Ceci est un simulateur d'API. En production, vous feriez un appel fetch/axios
// vers votre véritable backend d'authentification.

export const loginApi = async (identifier: string, password: string): Promise<LoginApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (identifier === "medecin@example.com" && password === "password123") {
        const successResponse: LoginSuccessResponse = {
          success: true,
          user: {
            id: "user-123",
            name: "Dr. Dupont",
            email: "medecin@example.com",
            role: "doctor",
          },
          token: "fake-jwt-token-for-dr-dupont-12345",
        };
        resolve(successResponse);
      } else {
        const failureResponse: LoginFailureResponse = {
          success: false,
          message: "Identifiant ou mot de passe incorrect.",
        };
        resolve(failureResponse);
      }
    }, 1000); // Simule un délai réseau d'une seconde
  });
};

export const logoutApi = async (): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Déconnexion réussie." });
    }, 300);
  });
};