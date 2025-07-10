'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { publicPaths } from '@/lib/constant';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();  

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && publicPaths.includes(pathname)) {
      router.push('/dashboard');
      return;
    } 
  }, [isAuthenticated, loading, pathname, router]);

  // Affichez un état de chargement pendant que le statut d'authentification est déterminé.
  // Ceci assure une cohérence entre le rendu serveur et client.
  
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <p className="text-xl text-gray-700">Chargement de la session...</p>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default AuthGuard;
