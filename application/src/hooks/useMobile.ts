/**
 * Hook personnalisé pour la détection des appareils mobiles
 * 
 * Ce hook utilise l'API MediaQuery pour détecter si l'utilisateur
 * utilise un appareil mobile (largeur d'écran <= 767px) et met à jour
 * l'état en temps réel lors des changements de taille d'écran.
 * 
 * Fonctionnalités :
 * - Détection automatique de la taille d'écran
 * - Mise à jour en temps réel lors du redimensionnement
 * - Nettoyage automatique des event listeners
 * - Compatibilité avec le SSR (Server-Side Rendering)
 * 
 * @returns boolean - true si l'appareil est mobile, false sinon
 * 
 * Utilisation :
 * ```tsx
 * const isMobile = useMobile();
 * 
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     {isMobile ? <MobileComponent /> : <DesktopComponent />}
 *   </div>
 * );
 * ```
 */

import { useEffect, useState } from 'react';

/**
 * Hook pour détecter les appareils mobiles
 * 
 * @returns boolean - true si l'écran fait 767px ou moins de large
 */
export default function useIsMobile(): boolean {
  // État pour stocker si l'appareil est mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Création d'une media query pour les écrans mobiles
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    // Fonction pour mettre à jour l'état selon la media query
    const updateMatch = () => setIsMobile(mediaQuery.matches);

    // Vérification initiale
    updateMatch();

    // Ajout de l'event listener pour les changements de taille d'écran
    mediaQuery.addEventListener('change', updateMatch);
    
    // Nettoyage : suppression de l'event listener lors du démontage
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  return isMobile;
}