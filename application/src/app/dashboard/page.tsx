/**
 * Page Dashboard principal de l'application AdminJO
 *
 * Cette page constitue le point d'entrée principal de l'interface d'administration
 * des Jeux Olympiques 2024. Elle offre une vue d'ensemble des fonctionnalités
 * disponibles et des statistiques en temps réel.
 *
 * @module DashboardPage
 */

'use client';

import Link from 'next/link';
import { dashboardSections } from '@/types/dashBoardSections/dashboardSections';
import PageTemplate from '@/components/layout/PageTemplate';
import {JSX} from "react";

/**
 * Composant de la page Dashboard principal
 *
 * Ce composant affiche le tableau de bord principal de l'application d'administration
 * des JO 2024. Il présente une interface simple avec des cartes de navigation
 * vers les différentes sections administratives et un panel de statistiques statiques.
 *
 * @name DashboardPage
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Navigation modulaire
 * - **Cartes interactives** : Affichage des sections disponibles sous forme de cartes colorées
 * - **Navigation directe** : Liens Next.js vers chaque module de l'application
 * - **Effets visuels** : Transformations et ombres au survol des cartes
 *
 *
 * ## Structure réelle de la page
 *
 * 1. **PageTemplate** : Container avec titre et introduction standardisés
 * 2. **Grille de navigation** : Cartes issues de `dashboardSections`
 * 3. **Panel statistiques** : Section fixe avec 4 métriques non fonctionnelles
 *
 * ## Configuration des sections
 *
 * Les 6 sections sont définies dans `dashboardSections.ts` :
 * - **Événements sportifs** (`/pagesEvenements`)
 * - **Offres** (`/pageOffre`)
 * - **Employés** (`/employees`)
 * - **Utilisateurs** (`/users`)
 *
 * ## Interactions utilisateur réelles
 *
 * - **Clic sur carte** : Navigation vers l'URL de la section via Next.js Link
 * - **Hover sur carte** : Scale 105% + shadow-xl (transition 200ms)
 * - **Accessibilité** : Liens sémantiques avec texte descriptif
 *
 * @returns {JSX.Element} Dashboard avec navigation et statistiques statiques
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link dashboardSections} - Configuration des sections de navigation
 * @see dashboardSections.ts - Types et interfaces des sections
 *
 */
export function DashboardPage(): JSX.Element {
    return (
        <PageTemplate
            title="Administration JO 2024"
            intro={{
                title: "Tableau de bord d'administration",
                description: "Sélectionnez une section pour commencer la gestion"
            }}
        >
            {/*
             * Grille de navigation principale
             * Layout responsive avec cartes interactives pour chaque section administrative
             */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {dashboardSections.map((section) => (
                    /**
                     * Carte de navigation vers une section administrative
                     *
                     * Chaque carte représente un module de l'application avec :
                     * - Couleur distinctive définie dans la configuration
                     * - Icône représentative du domaine métier
                     * - Titre et description explicites
                     * - Effets d'interaction (hover, scale, shadow)
                     *
                     * @param {DashboardSection} section - Configuration de la section
                     * @param {string} section.url - Route de destination
                     * @param {string} section.title - Titre affiché sur la carte
                     * @param {string} section.description - Description de la fonctionnalité
                     * @param {string} section.icon - Emoji ou icône représentative
                     * @param {string} section.color - Classes CSS pour la couleur de fond
                     */
                    <Link
                        key={section.url}
                        href={section.url}
                        className={`${section.color} text-white rounded-lg p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl block`}
                    >
                        <div className="text-center">
                            {/* Icône principale de la section */}
                            <div className="text-6xl mb-4">
                                {section.icon}
                            </div>
                            {/* Titre de la section */}
                            <h3 className="text-xl font-bold mb-2">
                                {section.title}
                            </h3>
                            {/* Description détaillée */}
                            <p className="text-white/90 text-sm">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/*
             * Panel des statistiques rapides
             * Affichage des métriques clés de l'administration en temps réel
             */}
            <div className="mt-16 bg-white rounded-lg shadow-md p-8">
                {/* Titre du panel statistiques */}
                <h3 className="text-xl font-bold text-gray-900 mb-6">Statistiques rapides</h3>

                {/*
                 * Grille des métriques principales
                 * Layout responsive avec 4 colonnes sur desktop, 1 sur mobile
                 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/*
                     * Métrique : Événements sportifs
                     * Affiche le nombre total d'événements programmés
                     * @todo Connecter à l'API pour récupérer la valeur réelle
                     */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">_</div>
                        <div className="text-sm text-gray-600">Événements sportifs</div>
                    </div>

                    {/*
                     * Métrique : Utilisateurs actifs
                     * Affiche le nombre d'utilisateurs connectés ou actifs
                     * @todo Implémenter le compteur d'utilisateurs actifs
                     */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">_</div>
                        <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                    </div>

                    {/*
                     * Métrique : Offres disponibles
                     * Affiche le nombre d'offres de billeterie actives
                     * @todo Connecter au service des offres
                     */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">_</div>
                        <div className="text-sm text-gray-600">Offres disponibles</div>
                    </div>

                    {/*
                     * Métrique : Employés
                     * Affiche le nombre total d'employés dans le système
                     * @todo Intégrer avec le service de gestion des employés
                     */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">_</div>
                        <div className="text-sm text-gray-600">Employés</div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}

export default DashboardPage;
