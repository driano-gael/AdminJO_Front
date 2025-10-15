/**
 * Page principale de gestion des événements sportifs AdminJO
 *
 * Cette page constitue le point d'entrée principal pour la gestion des événements sportifs
 * dans l'application d'administration des Jeux Olympiques 2024. Elle sert de hub de navigation
 * vers les différentes sections de gestion des événements.
 *
 * @module PagesEvenementsIndex
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import Link from 'next/link';
import {JSX} from "react";

/**
 * Composant de la page d'index des événements
 *
 * Cette page constitue le hub central de navigation pour toutes les fonctionnalités
 * liées aux événements sportifs des Jeux Olympiques 2024. Elle offre une interface
 * de navigation claire vers les différents modules de gestion événementielle.
 *
 * @name PagesEvenementsIndex
 *
 * ## Fonctionnalités implémentées
 *
 * ### Navigation centralisée
 * - **Cartes de navigation** : Accès direct aux 4 sections principales
 * - **Interface intuitive** : Design cohérent avec le dashboard principal
 * - **Breadcrumbs** : Navigation contextuelle depuis le dashboard
 *
 * ## Sections de navigation disponibles
 *
 * ### Événements
 * - **Route** : `/pagesEvenements/evenements`
 * - **Fonctionnalités** : CRUD complet avec filtrage avancé (6 filtres)
 * - **Composant** : EvenementsManagement
 *
 * ### 🏟Lieux
 * - **Route** : `/pagesEvenements/lieux`
 * - **Fonctionnalités** : CRUD complet avec recherche textuelle
 * - **Composant** : LieuxManagement
 *
 * ### Disciplines
 * - **Route** : `/pagesEvenements/disciplines`
 * - **Fonctionnalités** : CRUD complet avec recherche textuelle
 * - **Composant** : DisciplinesManagement
 *
 * ### Épreuves
 * - **Route** : `/pagesEvenements/epreuves`
 * - **Fonctionnalités** : CRUD complet avec recherche et filtrage par discipline
 * - **Composant** : EpreuvesManagement
 *
 * ## Structure de navigation
 *
 * La page présente une grille de cartes navigables similaire au dashboard principal,
 * chaque carte représentant une section de gestion avec :
 * - Icône distinctive
 * - Titre descriptif
 * - Description des fonctionnalités
 * - Lien direct vers la section
 *
 * ## Workflow utilisateur
 *
 * 1. **Accès depuis dashboard** : Navigation via la carte "Événements sportifs"
 * 2. **Vue d'ensemble** : Présentation des 4 sections disponibles
 * 3. **Sélection** : Clic sur une carte pour accéder à la section désirée
 * 4. **Navigation** : Breadcrumbs pour retour au hub ou dashboard
 *
 * @returns {JSX.Element} Page de navigation vers les sections de gestion des événements
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link EvenementsManagement} - Interface de gestion des événements
 * @see {@link LieuxManagement} - Interface de gestion des lieux
 * @see {@link DisciplinesManagement} - Interface de gestion des disciplines
 * @see {@link EpreuvesManagement} - Interface de gestion des épreuves
 *
 */

export default function PagesEvenementsIndex(): JSX.Element {
    const sections = [
        {
            url: '/pagesEvenements/evenements',
            title: 'Gestion des événements',
            description: 'Créer, modifier et gérer les événements sportifs avec filtrage avancé',
            icon: '📅',
            color: 'bg-indigo-500 hover:bg-indigo-600'
        },
        {
            url: '/pagesEvenements/lieux',
            title: 'Gestion des lieux',
            description: 'Administrer les sites de compétition et lieux olympiques',
            icon: '🏟️',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            url: '/pagesEvenements/disciplines',
            title: 'Gestion des disciplines',
            description: 'Configurer les disciplines sportives des Jeux Olympiques',
            icon: '🏅',
            color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
            url: '/pagesEvenements/epreuves',
            title: 'Gestion des épreuves',
            description: 'Créer et organiser les épreuves par discipline sportive',
            icon: '🏆',
            color: 'bg-orange-500 hover:bg-orange-600'
        }
    ];

    return (
        <PageTemplate
            title="Gestion des événements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Événements sportifs' }
            ]}
            intro={{
                title: "Administration des événements JO 2024",
                description: "Sélectionnez une section pour gérer les différents aspects des événements sportifs"
            }}
        >
            {/* Grille de navigation vers les sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {sections.map((section) => (
                    <Link
                        key={section.url}
                        href={section.url}
                        className={`${section.color} text-white rounded-lg p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl block`}
                    >
                        <div className="text-center">
                            {/* Icône de la section */}
                            <div className="text-6xl mb-4">
                                {section.icon}
                            </div>
                            {/* Titre de la section */}
                            <h3 className="text-xl font-bold mb-2">
                                {section.title}
                            </h3>
                            {/* Description des fonctionnalités */}
                            <p className="text-white/90 text-sm">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Section d'information sur les fonctionnalités */}
            <div className="mt-16 bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Fonctionnalités disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">CRUD</div>
                        <div className="text-sm text-gray-600">Opérations complètes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">Filtrage</div>
                        <div className="text-sm text-gray-600">Recherche avancée</div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}
