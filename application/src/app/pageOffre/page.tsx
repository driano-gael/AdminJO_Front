'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import OffresManagement from "@/components/componentOffre/OffresManagement";

/**
 * Page Gestion des offres - Route: /pageOffre
 *
 * Interface dédiée à la gestion des offres de ticket pour les evenement
 */
export default function OffrePage() {
  // const router = useRouter(); // Non utilisé pour le moment
  return (
    <PageTemplate
      title="Gestion des offres"
      breadcrumbs={[
        {label: 'Accueil', href: '/dashboard'},
        {label: 'offre'}
      ]}
    >
      {/* Composant de gestion des offres*/}
      <OffresManagement/>
    </PageTemplate>
  );
}