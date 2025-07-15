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

export default function AuthenticatedLayout({ 
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
