'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Définissez les chemins publics qui ne nécessitent PAS d'authentification
  const publicPaths = ['/login', '/register', '/forgot-password']; // Ajoutez ici toutes vos pages publiques

  useEffect(() => {
    // Si l'état de chargement est toujours en cours, ne faites rien pour l'instant
    if (loading) {
      return;
    }

    // CAS 1 : Utilisateur NON authentifié
    // Si l'utilisateur n'est PAS authentifié ET qu'il tente d'accéder à un chemin PROTÉGÉ,
    // redirigez-le vers la page de connexion.
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/login');
      return;
    }

    // CAS 2 : Utilisateur AUTHENTIFIÉ
    // Si l'utilisateur EST authentifié ET qu'il tente d'accéder à un chemin PUBLIC (ex: /login),
    // redirigez-le vers le tableau de bord.
    if (isAuthenticated && publicPaths.includes(pathname)) {
      router.push('/dashboard');
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading, pathname, router]);

  // Affichez un état de chargement pendant que le statut d'authentification est déterminé.
  // Ceci assure une cohérence entre le rendu serveur et client.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Chargement de la session...</p>
      </div>
    );
  }

  // Si l'utilisateur est authentifié OU sur un chemin public,
  // nous rendons les enfants. Le layout spécifique au groupe (home)
  // ou la page de login se chargera ensuite de son propre rendu.
  return <>{children}</>;
};

export default AuthGuard;
