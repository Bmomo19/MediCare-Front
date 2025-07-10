import axios from 'axios';

// Créez une instance Axios. C'est votre client API principal.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // Remplacez par l'URL de votre API Laravel
  withCredentials: true, // IMPORTANT: Permet l'envoi de cookies (session Laravel/Sanctum)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Variable pour suivre si une requête de rafraîchissement est en cours
let isRefreshing = false;
// File d'attente pour les requêtes en attente pendant le rafraîchissement du token
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      // Si le rafraîchissement a réussi, refaire la requête avec le nouveau token
      // Note: Pour Sanctum, il n'y a pas de "nouveau token d'accès" à ajouter aux headers,
      // c'est la session cookie qui est rafraîchie.
      // Si vous utilisez des tokens d'API personnalisés, vous devrez peut-être ajouter un header Authorization ici.
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de requêtes: Ajoute le token d'accès (si utilisé)
// Pour Sanctum SPA, le token est généralement géré par les cookies de session,
// donc ce n'est pas toujours nécessaire d'ajouter un header 'Authorization'.
// Si vous utilisez des tokens d'API générés manuellement par Sanctum, vous devriez l'ajouter ici.
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken'); // Si vous stockez un token d'API Sanctum manuellement
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses: Gère les erreurs 401 (Non autorisé)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et que ce n'est pas la requête de rafraîchissement elle-même
    // et qu'il n'y a pas déjà marqué la requête comme "retryée"
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marque la requête comme étant retryée

     
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Si le rafraîchissement a réussi, relancer la requête originale
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/sanctum/csrf-cookie`, {
          withCredentials: true
        });

        isRefreshing = false;
        processQueue(null);

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError); // Traite la file d'attente avec échec

        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
