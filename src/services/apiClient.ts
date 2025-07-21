// lib/apiClient.ts
import axios from 'axios';

// Créez une instance Axios. C'est votre client API principal.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true, // IMPORTANT: Permet l'envoi de cookies (session Laravel/Sanctum pour CSRF)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes: Ajoute le token d'accès et gère le CSRF pour les requêtes modifiantes
apiClient.interceptors.request.use(
  async (config) => {
    // Récupère le access token depuis sessionStorage
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Pour les requêtes qui modifient les données (POST, PUT, PATCH, DELETE)
    // et les endpoints de login/logout, assurez-vous que le cookie CSRF est à jour.
    const method = config.method?.toLowerCase();
    const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/logout');

    if (['post', 'put', 'patch', 'delete'].includes(method || '') || isAuthEndpoint) {
      try {
        // Cette requête GET à csrf-cookie mettra à jour le cookie XSRF-TOKEN dans le navigateur
        // Axios utilisera ensuite ce cookie pour l'en-tête X-XSRF-TOKEN
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/sanctum/csrf-cookie`, {
          withCredentials: true
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du CSRF token:', error);
        // Si le CSRF cookie ne peut pas être obtenu, la requête échouera avec 419 ou 401.
        // On ne rejette pas ici pour laisser l'intercepteur de réponse gérer l'erreur.
      }
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses: Gère les erreurs 401 (Non autorisé) et 419 (CSRF token mismatch)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    // Si l'erreur est 401 (token expiré/invalide) ou 419 (CSRF mismatch)
    // et que la requête n'a pas déjà été retryée
    if ((statusCode === 401 || statusCode === 419) && !originalRequest._retry) {
      originalRequest._retry = true; // Marque la requête comme étant retryée

      // Si le backend gère le rafraîchissement implicitement et qu'on reçoit un 401/419,
      // cela signifie que la session est définitivement terminée.
      // On redirige directement vers la page de connexion.
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken'); // Nettoyez le refresh token aussi
        sessionStorage.removeItem('authUser');
        window.location.href = '/login'; // Redirection complète pour nettoyer l'état
      }
      return Promise.reject(error); // Rejette l'erreur originale
    }

    return Promise.reject(error);
  }
);

export default apiClient;
