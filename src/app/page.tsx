// app/page.tsx
'use client'; // Indique que c'est un Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'; // Ajustez le chemin si nécessaire

// Métadonnées spécifiques à la page pour le SEO
// export const metadata = {
//   title: 'Accueil - MediCare',
//   description: 'Page d\'accueil du système de gestion médicale MediCare.',
// };

const HomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne rien faire si l'état de chargement de l'authentification est en cours
    if (loading) {
      return;
    }

    // Si l'utilisateur est authentifié, redirigez-le vers le tableau de bord
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // S'il n'est pas authentifié, redirigez-le vers la page de connexion
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Pendant le chargement ou la redirection, affichez un message ou un loader
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-700">Chargement de l&apos;application...</p>
    </div>
  );
};

export default HomePage;