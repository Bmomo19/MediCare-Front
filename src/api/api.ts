import { LoginApiResponse, LoginSuccessResponse, LoginFailureResponse } from '@/types/auth';


export const loginApi = async (identifier: string, password: string): Promise<LoginApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (identifier === "mhd" && password === "12345") {
        const successResponse: LoginSuccessResponse = {
          success: true,
          user: {
            id: "user-123",
            name: "Dr. Mhd",
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