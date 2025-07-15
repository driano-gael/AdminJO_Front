'use client';

import Link from 'next/link';
import { useAuthenticatedPage } from '@/hooks/useAuthenticatedPage';
import PageTemplate from '@/components/layout/PageTemplate';
import { managementSections } from '@/types/sportEvenement/managementSection';


export default function ManagementPage() {
    return (
        <PageTemplate
            title="🔧 Gestion Administrative"
            backUrl="/dashboard"
            backLabel="Retour au Gestion Sportive"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion' }
            ]}
            intro={{
                title: "Interface de Gestion des evenement sportifs",
                description: "Gérez les différents aspects des évènements sportifs des Jeux Olympiques"
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 mx-[2%]">
                {managementSections.map((section) => (
                    <Link
                        key={section.id}
                        href={section.href}
                        className={`${section.color} text-white rounded-lg p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl block`}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {section.title}
                            </h3>
                            <p className="text-white/90 text-sm">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </PageTemplate>
    );
}
