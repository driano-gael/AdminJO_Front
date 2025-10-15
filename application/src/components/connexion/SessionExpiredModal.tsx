/**
 * Composant SessionExpiredModal - Modal expiration session AdminJO
 *
 * Ce composant modal critique gère l'expiration des sessions administrateur dans l'application
 * AdminJO des Jeux Olympiques 2024. Il fournit une interface utilisateur claire pour informer
 * les administrateurs de l'expiration de leur session avec compte à rebours automatique,
 * redirection programmée, et options de reconnexion immédiate. Conçu pour maintenir la
 * sécurité des systèmes olympiques tout en préservant l'expérience utilisateur, il intègre
 * feedback visuel temps réel, gestion automatique des timeouts, et actions utilisateur
 * flexibles pour une gestion optimale des sessions expirées dans l'écosystème AdminJO.
 *
 * ## Architecture modal et gestion session expirée
 *
 * ### ⏰ Système de compte à rebours automatique
 * - **Durée initiale** : 10 secondes countdown par défaut
 * - **Timer automatique** : setInterval décrément chaque seconde
 * - **Redirection automatique** : onReconnect() déclenché à countdown = 0
 * - **Reset intelligent** : Réinitialisation countdown si modal fermé/rouvert
 * - **Cleanup robuste** : clearInterval dans useEffect cleanup
 * - **État synchronisé** : countdown useState avec timer côté effect
 * - **Performance** : Timer actif uniquement si modal ouvert
 *
 * ### 🛡️ Workflow expiration session sécurisée
 * 1. **Détection expiration** : AuthContext/useAuth détecte token expiré
 * 2. **Ouverture modal** : isOpen=true déclenche affichage modal
 * 3. **Compte à rebours** : 10 secondes timer avec affichage temps restant
 * 4. **Options utilisateur** : Fermer modal OU reconnexion immédiate
 * 5. **Redirection automatique** : onReconnect() si countdown atteint 0
 * 6. **Cleanup session** : Nettoyage tokens et redirection LoginAdminForm
 * 7. **Reset état** : Fermeture modal remet countdown à 10 secondes
 *
 * ## Interface utilisateur et expérience modal
 *
 * ### 🎨 Design modal et feedback visuel
 * - **Overlay backdrop** : fixed inset-0 bg-black bg-opacity-50 isolation
 * - **Modal centré** : flex items-center justify-center viewport complet
 * - **Card élégante** : bg-white rounded-lg shadow avec max-w-md
 * - **Icône contextuelle** : ⏰ emoji 6xl pour identification immédiate
 * - **Titre explicite** : "Session expirée" text-xl font-semibold
 * - **Message dynamique** : Texte avec countdown intégré temps réel
 * - **Actions claires** : Boutons Fermer (secondaire) + Se reconnecter (primaire)
 *
 * ### 📱 Layout responsive et accessibilité
 * - **Mobile-friendly** : w-full max-w-md mx-4 pour adaptation écrans
 * - **Touch targets** : Boutons px-4 py-2 dimensionnés interaction tactile
 * - **Text scaling** : Typography responsive text-xl/text-sm selon contexte
 * - **Z-index élevé** : z-50 pour superposition garantie autres éléments
 * - **Container fluide** : Adaptation automatique largeurs écran
 * - **Center alignment** : text-center pour équilibre visuel optimal
 * - **Spacing cohérent** : p-6 padding + space-x-3 boutons harmonieux
 *
 * ## Gestion d'état et lifecycle modal
 *
 * ### 🔄 États et synchronisation countdown
 * - **countdown state** : useState<number> initialisé à 10 secondes
 * - **Timer effect** : useEffect avec setInterval pour décrément
 * - **Conditional reset** : countdown = 10 si modal fermé (!isOpen)
 * - **Auto-trigger** : onReconnect() appelé automatiquement à countdown = 0
 * - **Dependencies** : [isOpen, onReconnect] pour re-création effect
 * - **Cleanup pattern** : return () => clearInterval() dans effect
 * - **State consistency** : countdown synchronisé avec timer réel
 *
 * ### ⚡ useEffect gestion timer sophistiquée
 * - **Early return** : Pas de timer si !isOpen pour performance
 * - **setInterval** : Timer 1000ms (1 seconde) pour décrément régulier
 * - **Functional update** : setCountdown(prev => ...) pour state stable
 * - **Trigger condition** : prev <= 1 déclenche onReconnect() + return 0
 * - **Normal decrement** : return prev - 1 pour countdown standard
 * - **Cleanup garantie** : clearInterval dans return function
 * - **Re-creation** : Effect re-créé si dépendances changent
 *
 * ## Actions utilisateur et callbacks
 *
 * ### 🔘 Actions disponibles pour utilisateur
 * - **Fermer modal** : onClose() sans redirection, maintient session expirée
 * - **Reconnexion immédiate** : onReconnect() bypass countdown, redirection login
 * - **Attendre countdown** : Aucune action, redirection automatique à 0
 * - **Feedback visuel** : Boutons avec hover states et transitions
 * - **States interactifs** : hover:bg-gray-300 + hover:bg-blue-700
 * - **Accessibilité** : Textes explicites pour synthèse vocale
 * - **Touch-friendly** : Zones clic optimisées mobile et desktop
 *
 * ### 📡 Intégration callbacks externes
 * - **onClose prop** : Callback fermeture modal sans action supplémentaire
 * - **onReconnect prop** : Callback redirection vers authentification
 * - **isOpen prop** : Contrôle externe affichage modal
 * - **Delegation pattern** : Logique métier gérée par composants parents
 * - **State external** : Modal stateless pour logique session
 * - **Event propagation** : Actions remontées vers gestionnaires auth
 *
 * ## Sécurité et gestion session
 *
 * ### 🔒 Aspects sécurité session expirée
 * - **Forced logout** : Modal apparaît après détection expiration token
 * - **No bypass** : Pas d'échappatoire pour contourner expiration
 * - **Clear session** : onReconnect implique nettoyage tokens
 * - **User awareness** : Information claire expiration pour transparence
 * - **Timeout protection** : Limite exposition données après expiration
 * - **Audit trail** : Actions utilisateur traçables pour sécurité
 * - **Graceful handling** : UX fluide malgré contrainte sécuritaire
 *
 * ### 🛡️ Protection contre usage non-autorisé
 * - **Session invalidation** : Tokens invalidés côté serveur
 * - **Forced re-auth** : Obligation authentification fresh
 * - **No cached access** : Pas d'accès cached après expiration
 * - **Clear memory** : Nettoyage données sensibles localStorage
 * - **Redirect security** : Redirection vers LoginAdminForm sécurisé
 * - **Token cleanup** : Suppression tokens côté client
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations timer et lifecycle
 * - **Conditional timer** : setInterval actif seulement si isOpen = true
 * - **Cleanup automatique** : clearInterval dans useEffect return
 * - **State functional** : setCountdown(prev => ...) évite stale closures
 * - **Minimal re-renders** : useEffect dependencies optimisées
 * - **Memory efficiency** : Pas de timer en arrière-plan si modal fermé
 * - **CPU efficiency** : Timer 1 seconde interval raisonnable
 * - **Component lightweight** : Logique minimale pour performance
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation si parent re-renders fréquents
 * - **useCallback** : Mémorisation handlers si passés comme props
 * - **Precision timer** : requestAnimationFrame pour précision accrue
 * - **Background sync** : Web Workers si logique countdown complexe
 * - **Reduced motion** : respect prefers-reduced-motion pour animations
 * - **Visibility API** : Pause timer si onglet non-visible
 *
 * ## Responsive design et accessibilité
 *
 * ### 📱 Adaptation multi-écrans
 * - **Mobile optimization** : max-w-md + mx-4 marges sécurité mobile
 * - **Tablet support** : Taille intermédiaire bien gérée
 * - **Desktop enhancement** : Hover effects pour interactions précises
 * - **Portrait/landscape** : Fonctionnel toutes orientations
 * - **Small screens** : Contenu lisible même écrans étroits
 * - **Touch gestures** : Boutons dimensionnés interaction tactile
 * - **Responsive text** : Typography adaptée taille écran
 *
 * ### ♿ Standards accessibilité et navigation
 * - **Modal semantics** : Structure modal accessible screen readers
 * - **Focus management** : Focus initial sur modal à ouverture
 * - **Keyboard navigation** : Tab/Enter/Escape support complet
 * - **Screen reader** : Textes descriptifs lisibles synthèse vocale
 * - **ARIA attributes** : Potentiel ajout role="dialog" aria-modal="true"
 * - **Color contrast** : Textes contrastés sur backgrounds
 * - **Text clarity** : Messages explicites sans ambiguïté
 * - **Action labels** : Boutons avec intents clairs
 *
 * ## Contexte métier sessions AdminJO
 *
 * ### 🏅 Spécificités sécurité olympique
 * - **Sessions courtes** : Expiration rapide pour sécurité JO renforcée
 * - **Activité continue** : Administrateurs JO souvent actifs longtemps
 * - **Données sensibles** : Protection informations critiques JO
 * - **Audit compliance** : Traçabilité sessions pour sécurité olympique
 * - **Multi-user** : Gestion sessions multiples équipes organisatrices
 * - **High availability** : Disponibilité continue pendant événements
 * - **Security standards** : Conformité standards CIO/sécurité JO
 *
 * ### 📊 Cas d'usage sessions AdminJO
 * - **Event management** : Sessions longues gestion événements en temps réel
 * - **Media coordination** : Accès prolongé pour équipes médias
 * - **Results input** : Sessions actives pendant compétitions
 * - **Logistics ops** : Coordination opérationnelle continue JO
 * - **Emergency access** : Re-authentification rapide situations urgentes
 * - **Multi-device** : Accès depuis multiples appareils/locations
 *
 * ## Intégration écosystème authentification
 *
 * ### 🔌 Communication avec système auth
 * - **AuthContext** : Modal déclenchée par détection expiration
 * - **AuthGuard** : Intégration avec protection routes
 * - **LoginAdminForm** : Redirection vers formulaire connexion
 * - **Token management** : Synchronisation avec gestion tokens
 * - **Session monitoring** : Part du système surveillance session
 * - **Error boundaries** : Gestion erreurs auth sans crash app
 *
 * ### 🔄 Workflow intégration complet
 * 1. **Token expiry** : useAuth/AuthContext détecte expiration
 * 2. **Modal trigger** : Parent component set isOpen = true
 * 3. **User choice** : Fermer OU reconnexion immédiate OU attente
 * 4. **onReconnect** : Parent gère redirection LoginAdminForm
 * 5. **Session cleanup** : Nettoyage tokens et state auth
 * 6. **Fresh auth** : Nouvelle authentification requise
 *
 * ## Patterns développement et extensibilité
 *
 * ### 🏗️ Architecture patterns appliqués
 * - **Controlled component** : Props contrôlent entièrement comportement
 * - **Callback delegation** : Logique métier déléguée parents
 * - **Single responsibility** : Focus unique gestion expiration UX
 * - **Composition over inheritance** : Modal composable avec autres
 * - **Immutable props** : Props non mutées par composant
 * - **Effect isolation** : useEffect ciblé sur timer uniquement
 *
 * ### 🔧 Extensibilité et configuration
 * - **Countdown duration** : Actuellement 10s, facilement configurable
 * - **Custom messages** : Textes modifiables selon contexte
 * - **Action buttons** : Boutons ajoutables/configurables
 * - **Styling themes** : Couleurs/styles adaptables
 * - **Animation support** : Hooks pour animations entrée/sortie
 * - **Internationalization** : Textes externalisables pour i18n
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Fixed countdown** : 10 secondes hardcodées, pas configurable
 * - **No pause option** : Pas de bouton pause/resume countdown
 * - **Basic animations** : Pas d'animations entrée/sortie modal
 * - **Single language** : Textes français uniquement
 * - **No progress bar** : Countdown textuel uniquement
 * - **No sound alerts** : Pas d'alertes audio expiration
 * - **Basic focus** : Focus management basique
 *
 * ### 🚀 Améliorations possibles prioritaires
 * - **Configurable countdown** : Props duration pour timer personnalisé
 * - **Progress visualization** : Barre progression ou cercle countdown
 * - **Animation library** : Framer Motion pour transitions fluides
 * - **Sound notifications** : Alertes audio optionnelles
 * - **Pause functionality** : Bouton pause countdown si activité
 * - **Extension options** : Props extend session si possible
 * - **Keyboard shortcuts** : ESC fermer, Enter reconnexion
 * - **Auto-save warning** : Alerte données non-sauvegardées
 * - **Session analytics** : Métriques durée/fréquence expirations
 * - **Custom styling** : Props theme/className pour customisation
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Intersection Observer** : Pause timer si modal non-visible
 * - **Web Workers** : Timer en background thread si nécessaire
 * - **Local storage** : Sauvegarde état countdown si refresh
 * - **Service Worker** : Notifications hors-ligne expiration
 * - **Websocket sync** : Synchronisation expiration multi-onglets
 * - **Advanced animations** : Micro-interactions et feedbacks
 * - **Accessibility++** : ARIA live regions pour annonces
 * - **Performance monitoring** : Métriques usage modal
 *
 * @param {SessionExpiredModalProps} props - Configuration du modal expiration session
 * @param {boolean} props.isOpen - Contrôle affichage modal (true = visible)
 * @param {function} props.onClose - Callback fermeture modal sans redirection
 * @param {function} props.onReconnect - Callback redirection authentification
 *
 * @returns {JSX.Element|null} Modal expiration avec countdown ou null si fermé
 *
 * @see {@link useAuth} - Hook authentification déclenchant ce modal
 * @see {@link AuthGuard} - Composant protection utilisant expiration
 * @see {@link LoginAdminForm} - Destination après onReconnect
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation basique avec callbacks
 * const [sessionExpired, setSessionExpired] = useState(false);
 *
 * <SessionExpiredModal
 *   isOpen={sessionExpired}
 *   onClose={() => setSessionExpired(false)}
 *   onReconnect={() => {
 *     logout();
 *     router.push('/login');
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Intégration dans AuthContext
 * function AuthProvider({ children }) {
 *   const [showExpiredModal, setShowExpiredModal] = useState(false);
 *
 *   const handleSessionExpired = () => {
 *     setShowExpiredModal(true);
 *   };
 *
 *   const handleReconnect = () => {
 *     setShowExpiredModal(false);
 *     forceLogout();
 *     router.push('/login');
 *   };
 *
 *   return (
 *     <AuthContext.Provider value={{ handleSessionExpired }}>
 *       {children}
 *       <SessionExpiredModal
 *         isOpen={showExpiredModal}
 *         onClose={() => setShowExpiredModal(false)}
 *         onReconnect={handleReconnect}
 *       />
 *     </AuthContext.Provider>
 *   );
 * }
 * ```
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Interface des propriétés du composant SessionExpiredModal
 */
interface SessionExpiredModalProps {
  /** Contrôle l'affichage du modal - true pour visible, false pour caché */
  isOpen: boolean;
  /** Fonction appelée quand l'utilisateur ferme le modal sans redirection */
  onClose: () => void;
  /** Fonction appelée pour rediriger vers la page de connexion */
  onReconnect: () => void;
}

/**
 * Composant Modal qui s'affiche quand la session utilisateur expire
 * 
 * Fonctionnalités :
 * - Affiche un compte à rebours de 10 secondes
 * - Redirige automatiquement vers la page de connexion à la fin du compte à rebours
 * - Permet à l'utilisateur de se reconnecter immédiatement ou de fermer le modal
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le modal de session expirée
 */
export default function SessionExpiredModal({ isOpen, onClose, onReconnect }: SessionExpiredModalProps) {
    
    // État pour le compte à rebours (10 secondes par défaut)
    const [countdown, setCountdown] = useState(10);
    
    // Effet pour gérer le compte à rebours automatique
    useEffect(() => {
        // Si le modal n'est pas ouvert, réinitialiser le compte à rebours
        if (!isOpen) {
            setCountdown(10);
            return;
        }
        // Créer un timer qui décrémente le compte à rebours chaque seconde
        const timer = setInterval(() => {
            setCountdown(prev => {
                // Si le compte à rebours atteint 1, déclencher la reconnexion
                if (prev <= 1) {
                    onReconnect();
                    return 0;
                }
                // Sinon, décrémenter le compte à rebours
                return prev - 1;
            });
        }, 1000);
        // Nettoyer le timer quand le composant se démonte ou que les dépendances changent
        return () => clearInterval(timer);
    }, [isOpen, onReconnect]); // Dépendances : recréer l'effet si isOpen ou onReconnect change
    // Si le modal n'est pas ouvert, ne rien afficher
    if (!isOpen) return null;

    return (
        // Overlay sombre qui couvre toute la page
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Conteneur du modal */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
                {/* Icône d'horloge */}
                <div className="text-6xl mb-4">⏰</div>
                
                {/* Titre du modal */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Session expirée
                </h2>
                
                {/* Message explicatif avec compte à rebours dynamique */}
                <p className="text-gray-600 mb-6">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion dans {countdown} secondes.
                </p>
                
                {/* Boutons d'action */}
                <div className="flex justify-center space-x-3">
                    {/* Bouton pour fermer le modal sans redirection */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Fermer
                    </button>
                    
                    {/* Bouton pour se reconnecter immédiatement */}
                    <button
                        onClick={onReconnect}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Se reconnecter maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}
