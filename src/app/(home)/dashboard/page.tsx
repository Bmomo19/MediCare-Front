'use client';
import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Note: La redirection si non authentifié est gérée dans _app.js.
  // Cependant, un fallback simple peut être ajouté ici pour plus de robustesse.
  if (!user) {
    return null; // Ou un message de "Non autorisé" qui se redirigera via _app.js
  }

  return (
    <>
      {/* <Head>
        <title>Tableau de bord - MediCare</title>
        <meta name="description" content="Tableau de bord de votre système de gestion médicale." />
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Tableau de bord Médical
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Bonjour, <span className="font-semibold text-indigo-600">{user.name || user.email}</span> !
            Bienvenue sur votre espace de gestion MediCare.
          </p>
          <p className="text-gray-600 mb-8">
            Vous êtes connecté(e) en tant que <span className="font-medium text-purple-600">{user.role || 'utilisateur'}</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Gestion des Patients</h3>
              <p className="text-blue-700">Accédez aux dossiers des patients, historiques et rendez-vous.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-green-800 mb-2">Planning des Rendez-vous</h3>
              <p className="text-green-700">Visualisez et gérez votre emploi du temps et les consultations.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-purple-800 mb-2">Rapports et Statistiques</h3>
              <p className="text-purple-700">Consultez les données clés de votre activité.</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-10 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Se déconnecter
          </button>
        </div>
      </div> */}
    </>
  );
};

export default DashboardPage;