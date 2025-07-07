'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/connexion/authGuard';
import AppHeader from '@/components/navigation/AppHeader';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

/**
 * Props pour le composant AuthenticatedLayout
 */
interface AuthenticatedLayoutProps {
  children: ReactNode;
  title: string;
  backUrl?: string;
  backLabel?: string;
}

/**
 * Layout pour toutes les pages authentifiées
 * 
 * Gère automatiquement :
 * - Protection par AuthGuard
 * - Header avec user info et déconnexion
 * - Session expiry monitoring
 * - Structure HTML commune
 */
export default function AuthenticatedLayout({ 
    children, 
    title, 
    backUrl, 
    backLabel 
}: AuthenticatedLayoutProps) {
    // Activation de la gestion automatique de l'expiration de session
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
