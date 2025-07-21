import { ApiResponse, LoginCredentials, MedUser, Session } from '@/types/auth';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

class AuthService {
    private api: AxiosInstance;
    private tokenRefreshPromise: Promise<string> | null = null;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: false,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - Ajouter le token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getStoredToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Gérer le renouvellement automatique
        this.api.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                this.handleTokenRefresh(response);
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Session expirée
                if (error.response?.status === 401 && !originalRequest._retry) {
                    this.handleSessionExpired();
                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );
    }

    private handleTokenRefresh(response: AxiosResponse<ApiResponse>): void {
        const sessionInfo = response.data?.session_info;

        if (sessionInfo?.token_refreshed && sessionInfo.new_token) {
            console.log('🔄 Token médical renouvelé automatiquement');

            // Sauvegarder le nouveau token
            this.storeToken(sessionInfo.new_token, sessionInfo.expires_at);

            // Afficher notification discrète
            toast.success('Session prolongée automatiquement', {
                duration: 2000,
                position: 'bottom-right',
            });
        }

        // Informer du temps restant si proche de l'expiration
        const expiresIn = response.headers['x-session-expires-in'];
        if (expiresIn && parseInt(expiresIn) <= 2) {
            toast.error('Session expire bientôt...', {
                duration: 3000,
                position: 'top-center',
            });
        }
    }

    private handleSessionExpired(): void {
        console.log('🚨 Session médicale expirée');

        // Nettoyer le stockage
        this.clearStoredSession();

        // Rediriger vers la page de connexion
        window.location.href = '/login';

        toast.error('Session expirée. Reconnexion requise.', {
            duration: 5000,
            position: 'top-center',
        });
    }

    // Méthodes publiques
    async login(credentials: LoginCredentials): Promise<Session> {
        try {
            const response = await this.api.post<ApiResponse<{
                user: MedUser;
                token: string;
                token_type: string;
                expires_at: string;
                expires_in_minutes: number;
            }>>('/v1/auth/login', credentials);

            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message || 'Échec de la connexion');
            }

            const { user, token, expires_at } = response.data.data;

            // Stocker la session
            const session: Session = {
                user,
                token,
                expires_at,
                session_type: 'medical'
            };

            this.storeSession(session);

            console.log('✅ Connexion médicale réussie:', user.name, `(${user.role})`);

            return session;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('❌ Erreur de connexion:', error.message);
            throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post('/v1/auth/logout');
            console.log('✅ Déconnexion sécurisée effectuée');
        } catch (error) {
            console.warn('⚠️ Erreur lors de la déconnexion:', error);
        } finally {
            this.clearStoredSession();
        }
    }

    async getSessionStatus(): Promise<{
        session_valid: boolean;
        expires_in_minutes: number;
        user_role: string;
        clinic_id?: number;
    }> {
        const response = await this.api.get<ApiResponse>('/medical/session/status');
        return response.data.data;
    }

    // Gestion du stockage sécurisé
    private storeSession(session: Session): void {
        if (typeof window !== 'undefined') {
            // Utiliser sessionStorage pour plus de sécurité (pas de persistance après fermeture)
            sessionStorage.setItem('medicare_session', JSON.stringify(session));
            sessionStorage.setItem('medicare_token', session.token);
            sessionStorage.setItem('medicare_expires_at', session.expires_at);
        }
    }

    private storeToken(token: string, expiresAt: string): void {
        if (typeof window !== 'undefined') {
            const session = this.getStoredSession();
            if (session) {
                session.token = token;
                session.expires_at = expiresAt;
                this.storeSession(session);
            } else {
                sessionStorage.setItem('medicare_token', token);
                sessionStorage.setItem('medicare_expires_at', expiresAt);
            }
        }
    }

    getStoredToken(): string | null {
        if (typeof window === 'undefined') return null;
        return sessionStorage.getItem('medicare_token');
    }

    getStoredSession(): Session | null {
        if (typeof window === 'undefined') return null;
        const stored = sessionStorage.getItem('medicare_session');
        return stored ? JSON.parse(stored) : null;
    }

    private clearStoredSession(): void {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('medicare_session');
            sessionStorage.removeItem('medicare_token');
            sessionStorage.removeItem('medicare_expires_at');
        }
    }

    isAuthenticated(): boolean {
        const session = this.getStoredSession();
        if (!session) return false;

        // Vérifier si le token n'est pas expiré
        const expiresAt = new Date(session.expires_at);
        const now = new Date();

        return now < expiresAt;
    }

    getCurrentUser(): MedUser | null {
        const session = this.getStoredSession();
        return session?.user || null;
    }

    // Méthodes API pour les données médicales
    async getPatients(params?: { page?: number; search?: string }) {
        const response = await this.api.get('/medical/patients', { params });
        return response.data;
    }

    async getConsultations(params?: { patient_id?: number; date?: string }) {
        const response = await this.api.get('/medical/consultations', { params });
        return response.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createConsultation(data: any) {
        const response = await this.api.post('/medical/consultations', data);
        return response.data;
    }
}

// Instance singleton
export const authService = new AuthService();