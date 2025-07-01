import React from 'react';

export default function DashboardPage() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur le Tableau de Bord !</h1>
      <p className="text-gray-700 text-lg mb-6">
        Ceci est le contenu principal de votre application. Utilisez la barre latérale pour naviguer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exemple de carte */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-200">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Patients Actifs</h2>
          <p className="text-4xl font-bold text-indigo-900">1,234</p>
          <p className="text-sm text-gray-500 mt-2">Dernière mise à jour : il y a 5 minutes</p>
        </div>

        {/* Exemple de carte */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Rendez-vous Aujourd&apos;hui</h2>
          <p className="text-4xl font-bold text-green-900">45</p>
          <p className="text-sm text-gray-500 mt-2">12 en attente</p>
        </div>

        {/* Exemple de carte */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Alertes Critiques</h2>
          <p className="text-4xl font-bold text-red-900">3</p>
          <p className="text-sm text-gray-500 mt-2">Nécessite une action immédiate</p>
        </div>

        {/* Ajoutez plus de contenu ici */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tableau des Activités Récentes</h2>
          <p className="text-gray-600">Un aperçu des dernières activités du système.</p>
          {/* Un tableau ou une liste pourrait aller ici */}
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between items-center text-sm text-gray-700">
              <span>Patient Jean Dupont ajouté</span>
              <span className="text-gray-500">il y a 10 min</span>
            </li>
            <li className="flex justify-between items-center text-sm text-gray-700">
              <span>Rendez-vous avec Dr. Martin confirmé</span>
              <span className="text-gray-500">il y a 30 min</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

