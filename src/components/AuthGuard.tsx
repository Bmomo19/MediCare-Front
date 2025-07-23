'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { publicPaths } from '@/lib/constant';
import { Role } from '@/lib/enum';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
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
      if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
        return router.push('/dashboard/admin');
      } else if (user?.role === Role.DOCTOR) {
        return router.push('/dashboard/doctor');
      } else if (user?.role === Role.PATIENT) {
        return router.push('/dashboard/patient');
      }
    } 
  }, [isAuthenticated, loading, pathname, router, user?.role]);

  // Affichez un état de chargement pendant que le statut d'authentification est déterminé.
  
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
