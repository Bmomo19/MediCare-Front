// components/AuthGuard.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // `loading` from context indicates initial check
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login'];

  useEffect(() => {
    // If we are still determining auth state (initial client load)
    // or if we are on a public path, don't redirect yet.
    if (loading) {
      return;
    }

    // After loading, apply redirection logic
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/login');
    } else if (isAuthenticated && publicPaths.includes(pathname)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);


  // IMPORTANT: Only render children AFTER loading is complete AND if we are authenticated
  // Or, if we are on a public path (like login), always render its children
  // This prevents rendering content that might mismatch before localStorage is read.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Chargement de la session...</p>
      </div>
    );
  }

  // If we are on a public path, always render its children (login page content)
  if (publicPaths.includes(pathname)) {
      return <>{children}</>;
  }

  // If not loading, and on a protected path, and authenticated, render children
  if (isAuthenticated) {
      return <>{children}</>;
  }

  // If not loading, not authenticated, and on a protected path (should be redirected by useEffect),
  // we can render null or a small loader as the redirect is happening.
  return null;
};

export default AuthGuard;