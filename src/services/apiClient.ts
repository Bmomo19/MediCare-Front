// lib/apiClient.ts
import axios from 'axios';

// Créez une instance Axios. C'est votre client API principal.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true, // Garde ceci pour les cookies de session/CSRF de Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Variable pour suivre si une requête de rafraîchissement est en cours
let isRefreshing = false;
// File d'attente pour les requêtes en attente pendant le rafraîchissement du token
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

// Fonction pour traiter la file d'attente des requêtes
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token); // Résout avec le nouveau token (access token)
    }
  });
  failedQueue = [];
};

// Intercepteur de requêtes: Ajoute le token d'accès et gère le CSRF pour les requêtes modifiantes
apiClient.interceptors.request.use(
  async (config) => {
    // Récupère le access token depuis localStorage (sera mis à jour par AuthContext)
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Pour les requêtes qui modifient les données (et login/logout)
    // nous devons nous assurer que le cookie CSRF est présent.
    // Axios avec `withXSRFToken: true` (ou `xsrfHeaderName`) gère cela automatiquement
    // APRÈS avoir obtenu le cookie via `/sanctum/csrf-cookie`.
    // Nous appelons explicitement `/sanctum/csrf-cookie` avant les requêtes POST/PUT/PATCH/DELETE
    // pour garantir que le cookie est à jour.
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '') || config.url?.includes('/login') || config.url?.includes('/logout')) {
      try {
        // Cette requête GET à csrf-cookie mettra à jour le cookie XSRF-TOKEN dans le navigateur
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/sanctum/csrf-cookie`, {
          withCredentials: true
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du CSRF token:', error);
        // Ne pas rejeter, laisser la requête originale échouer si le token est vraiment manquant
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

    // Si l'erreur est 401 ou 419 et que ce n'est pas une requête déjà retryée
    if ((statusCode === 401 || statusCode === 419) && !originalRequest._retry) {
      originalRequest._retry = true; // Marque la requête comme étant retryée

      // Si une requête de rafraîchissement est déjà en cours, mettez la requête actuelle en file d'attente
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
          // Relancer la requête originale avec le nouveau token
          const newAccessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true; // Marque le début du processus de rafraîchissement

      try {
        // Tente de rafraîchir le token d'accès en utilisant le refresh token
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        if (!refreshToken) {
          throw new Error('Refresh token non trouvé. Redirection vers la connexion.');
        }

        // --- HYPOTHÈSE : Votre backend Laravel a un endpoint /refresh-token ---
        // Cet endpoint prend le refresh token et renvoie un nouvel access token (et refresh token)
        const refreshResponse = await axios.post<{ access_token: string; refresh_token: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/refresh-token`,
          { refresh_token: refreshToken },
          { withCredentials: true } // Important pour Sanctum si le refresh token est lié à la session
        );

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token; // Si le refresh token change

        // Mettre à jour les tokens dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Mettre à jour le token dans l'instance Axios pour les requêtes futures
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        processQueue(null, newAccessToken); // Traite la file d'attente avec succès

        // Relance la requête originale qui a échoué
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Échec du rafraîchissement du token:', refreshError);
        isRefreshing = false;
        processQueue(refreshError); // Traite la file d'attente avec échec

        // Si le rafraîchissement échoue, forcez la déconnexion
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authUser'); // Nettoyez aussi les infos utilisateur
          window.location.href = '/login'; // Redirection complète pour nettoyer l'état
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
