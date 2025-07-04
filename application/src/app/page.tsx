
/**
 * Page d'accueil de l'application AdminJO
 * 
 * Cette page sert de point d'entrée principal pour l'application d'administration
 * des Jeux Olympiques. Elle affiche directement le composant Dashboard qui gère
 * l'authentification et la navigation vers les différentes sections.
 * 
 * Route: / (racine de l'application)
 * 
 * Le composant Dashboard inclut :
 * - Vérification automatique de l'authentification
 * - Affichage du tableau de bord si connecté
 * - Redirection vers la page de connexion si non connecté
 */

import Dashboard from "@/components/dashboard/Dashboard";

/**
 * Composant Home - Page d'accueil
 * 
 * @returns JSX.Element - Le dashboard principal de l'application
 */
export default function Home() {
  return <Dashboard />;
}