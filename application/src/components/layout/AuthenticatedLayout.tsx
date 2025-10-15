/**
 * Composant AuthenticatedLayout - Layout principal protégé AdminJO
 *
 * @name AuthenticatedLayout
 * Ce composant layout fondamental orchestre la structure de page complète pour toutes
 * les interfaces protégées de l'application AdminJO des Jeux Olympiques 2024. Il combine
 * protection par authentification, navigation contextuelle, et architecture responsive
 * pour créer un environnement sécurisé et cohérent destiné aux administrateurs olympiques.
 * Conçu comme wrapper universel, il intègre AuthGuard pour sécurité, AppHeader pour
 * navigation, surveillance session automatique, et container responsive pour une
 * expérience utilisateur homogène à travers tous les modules de gestion des JO.
 *
 * ## Architecture layout et composition sécurisée
 *
 * ### 🛡Protection authentification multicouches
 * - **AuthGuard wrapper** : Protection automatique toutes pages utilisant ce layout
 * - **Session monitoring** : useSessionExpiry() surveillance continue validité session
 * - **Token refresh** : Renouvellement automatique tokens via AuthGuard
 * - **Redirections sécurisées** : LoginAdminForm si non authentifié
 * - **État global** : Synchronisation avec AuthContext pour cohérence
 * - **Pas de bypass** : Impossible accéder contenu sans authentification valide
 * - **Security by design** : Sécurité intégrée architecture, pas optionnelle
 *
 * ### Structure layout hiérarchique
 * 1. **AuthGuard** : Couche sécurité englobante (niveau 1)
 * 2. **Container principal** : bg-base-200 background cohérent (niveau 2)
 * 3. **AppHeader** : Navigation et titre contextuels (niveau 3)
 * 4. **Main content** : Zone contenu protégé children (niveau 4)
 * 5. **Session monitoring** : Hook surveillance invisible (transversal)
 *
 * ## Session monitoring et sécurité continue
 *
 * ### Surveillance session automatique
 * - **useSessionExpiry hook** : Monitoring continu validité session
 * - **Détection expiration** : Identification automatique tokens expirés
 * - **SessionExpiredModal** : Modal automatique si session expirée
 * - **Recovery graceful** : Gestion propre expirations sans crash
 * - **Background monitoring** : Surveillance transparente pour utilisateur
 * - **Cleanup automatique** : Nettoyage ressources si session invalidée
 *
 * @param {Props} props - Configuration du layout authentifié
 * @param {ReactNode} props.children - Contenu page à protéger et afficher
 * @param {string} props.title - Titre page pour AppHeader et identification
 * @param {string} [props.backUrl] - URL page parent pour navigation retour optionnelle
 * @param {string} [props.backLabel] - Texte bouton retour personnalisé optionnel
 *
 * @returns {JSX.Element} Layout complet avec protection auth et navigation
 *
 * @see {@link AuthGuard} - Composant protection authentification utilisé
 * @see {@link AppHeader} - Composant navigation avec titre et breadcrumb
 * @see {@link useSessionExpiry} - Hook surveillance session continue
 *
 */

'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/connexion/authGuard';
import AppHeader from '@/components/navigation/AppHeader';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

/**
 * Props pour le composant AuthenticatedLayout
 */
interface Props {
  children: ReactNode;
  title: string;
  backUrl?: string;
  backLabel?: string;
}

export function AuthenticatedLayout({
    children, 
    title, 
    backUrl, 
    backLabel 
}: Props) {
    useSessionExpiry();
    return (
        <AuthGuard>
            <div className="bg-base-200">
                <AppHeader 
                    title={title}
                    backUrl={backUrl}
                    backLabel={backLabel}
                />
                <main className="">
                {children}
                </main>
            </div>
        </AuthGuard>
    );
}
export default AuthenticatedLayout;
