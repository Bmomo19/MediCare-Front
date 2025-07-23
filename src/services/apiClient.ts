import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes
apiClient.interceptors.request.use(
  async (config) => {

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
apiClient.interceptors.response.use(
  (response) => {
    // Vérifie si un nouveau token est présent dans la réponse
    const sessionInfo = response.data?.session_info;

    if (sessionInfo?.token_refreshed && sessionInfo?.new_token) {
      const newToken = sessionInfo.new_token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newToken);
      }

      // Met à jour le token dans les headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    // Si l'erreur est 401 (token expiré/invalide) et que la requête n'a pas déjà été retryée
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authUser');
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
