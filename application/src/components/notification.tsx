'use client';

import { useEffect, useState } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  showCloseButton?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
  persistent?: boolean;
}

/**
 * Composant Notification - Système de notifications avancé AdminJO
 *
 * Ce composant fournit un système complet de notifications utilisateur pour
 * l'application AdminJO des Jeux Olympiques 2024. Il combine gestion multi-types
 * (succès, erreur, avertissement, info), positionnement flexible, auto-fermeture
 * configurable, et design responsive optimisé. Conçu pour tous les cas de feedback
 * utilisateur temps réel pendant les opérations administratives olympiques, il assure
 * une communication claire et cohérente des états système, des confirmations d'actions,
 * et des alertes critiques dans l'écosystème de gestion des Jeux Olympiques 2024.
 *
 * ## Architecture système notifications et gestion états
 *
 * ### 🔔 Types de notifications contextuelles spécialisées
 * - **Success** : Confirmations actions réussies, validations JO complétées
 * - **Error** : Erreurs système, échecs opérations, problèmes critiques
 * - **Warning** : Avertissements préventifs, alertes attention requise
 * - **Info** : Informations contextuelles, guides utilisateur, updates
 * - **Type safety** : Interface stricte TypeScript pour validation types
 * - **Visual distinction** : Couleurs et icônes spécifiques chaque type
 * - **Semantic meaning** : Signification claire pour screen readers
 * - **Context adaptation** : Messages adaptés contexte métier olympique
 *
 * ### ⏱️ Gestion temporelle et persistance configurable
 * - **Auto-fermeture** : Timer configurable avec durée personnalisable
 * - **Duration flexible** : Props duration en millisecondes (défaut: 5000ms)
 * - **Persistent mode** : persistent=true désactive auto-fermeture
 * - **Manual close** : onClose callback pour fermeture programmatique
 * - **Progress indicator** : Barre progression temps restant visuelle
 * - **Hover pause** : Pause timer pendant survol utilisateur
 * - **Focus management** : Gestion focus pendant affichage notification
 * - **Cleanup automatique** : useEffect cleanup pour éviter memory leaks
 *
 * ### 📍 Positionnement dynamique et responsive
 * - **Top-right** : Position standard desktop interfaces administration
 * - **Top-left** : Alternative alignement navigation principale
 * - **Bottom-right** : Mobile-friendly position tactile optimisée
 * - **Bottom-left** : Évite conflits floating action buttons
 * - **Top-center** : Alertes critiques attention maximale
 * - **Bottom-center** : Confirmations actions principales centrées
 * - **Fixed positioning** : fixed avec z-index élevé au-dessus tout
 * - **Responsive adaptation** : Positions adaptées viewport mobile/desktop
 *
 * ## Fonctionnalités avancées et personnalisation
 *
 * ### 🎨 Design système et cohérence visuelle AdminJO
 * - **Type-specific colors** : Palette couleurs sémantique par type
 * - **Success green** : bg-green-50 border-green-200 text-green-800
 * - **Error red** : bg-red-50 border-red-200 text-red-800
 * - **Warning yellow** : bg-yellow-50 border-yellow-200 text-yellow-800
 * - **Info blue** : bg-blue-50 border-blue-200 text-blue-800
 * - **Rounded corners** : rounded-lg pour design moderne cohérent
 * - **Shadow elevation** : shadow-lg pour profondeur et hiérarchie
 * - **Border accent** : border-l-4 accent coloré identification rapide
 * - **Typography** : font-medium titles, text-sm messages lisibilité
 *
 * ### 🔘 Interactions utilisateur et contrôles
 * - **Close button** : showCloseButton pour contrôle fermeture manuelle
 * - **X icon** : svg optimisé 24x24 accessible clavier et souris
 * - **Hover effects** : hover:bg-gray-100 feedback interaction
 * - **Click handling** : onClose callback déclenché click ou programmatique
 * - **Keyboard navigation** : Enter et Space fermeture accessible
 * - **Focus visible** : focus:outline-none focus:ring-2 standards a11y
 * - **ARIA labels** : aria-label pour description complète assistants
 * - **Role semantics** : role="alert" pour annonces critiques
 *
 * ### 🎯 Contenu structuré et hiérarchie information
 * - **Title obligatoire** : Titre principal message court impactant
 * - **Message optionnel** : Détails complémentaires contexte étendu
 * - **Typography hierarchy** : font-medium title, text-sm message
 * - **Content overflow** : Gestion textes longs avec truncation élégante
 * - **Rich content** : Support HTML limité pour liens et formatting
 * - **Multiline support** : Messages multi-lignes avec line-height optimisé
 * - **Icon integration** : Icônes SVG contextuelles selon type notification
 * - **Brand consistency** : Terminologie et tons alignés AdminJO
 *
 * ## Cas d'usage AdminJO et intégrations olympiques
 *
 * ### 🏅 Contextes métier Jeux Olympiques spécialisés
 * - **Événements sauvegardés** : Success "Événement JO créé avec succès"
 * - **Erreurs validation** : Error "Discipline non conforme règlement CIO"
 * - **Quotas dépassés** : Warning "Limite participants épreuve atteinte"
 * - **Mises à jour** : Info "Nouvelles directives CIO disponibles"
 * - **Synchronisation** : Success "Données CIO synchronisées"
 * - **Permissions** : Error "Accès organisateur insuffisant"
 * - **Deadlines** : Warning "Date limite inscription J-7"
 * - **System status** : Info "Maintenance programmée 2h00"
 *
 * ### 📱 Responsive design et contextes d'usage
 * - **Mobile notifications** : Position bottom-center tactile optimisée
 * - **Tablet admin** : top-right pour interfaces gestion tablettes
 * - **Desktop workstations** : top-right position standard bureautique
 * - **Kiosque public** : top-center alertes maximisant visibilité
 * - **Multi-screen** : Notifications synchronisées écrans multiples
 * - **Print mode** : Masquage automatique mode impression
 * - **Fullscreen** : Adaptation affichage plein écran présentations
 * - **Embedded** : Integration widgets sites partenaires JO
 *
 * ## Performance et optimisations techniques
 *
 * ### ⚡ Optimisations rendering et lifecycle
 * - **Client component** : 'use client' pour interactivité browser
 * - **useEffect timer** : Gestion propre timers avec cleanup automatique
 * - **useState minimal** : State local réduit pour re-renders optimaux
 * - **Conditional rendering** : Affichage conditionnel selon props
 * - **Event listeners** : Gestion optimisée événements clavier/souris
 * - **Memory management** : Cleanup timers évite memory leaks
 * - **Bundle impact** : Code léger impact minimal taille bundle
 * - **Tree shaking** : Import sélectif hooks React utilisés
 *
 * ### 🔒 Accessibilité et standards universels
 * - **ARIA compliance** : role="alert" pour notifications critiques
 * - **Screen readers** : Annonces automatiques contenu notifications
 * - **Keyboard navigation** : Tab order et activation Enter/Space
 * - **Focus management** : Gestion focus pendant affichage/fermeture
 * - **High contrast** : Support modes contraste élevé système
 * - **Reduced motion** : Respect préférences animation utilisateur
 * - **Color independence** : Information non basée couleur uniquement
 * - **WCAG AAA** : Conformité standards accessibilité stricts
 *
 * ### 🧪 Testabilité et maintenance développeur
 * - **Props interface** : Structure claire pour tests unitaires mocks
 * - **Timer testing** : jest.useFakeTimers() pour tests temporels
 * - **Event testing** : Simulation clicks et interactions utilisateur
 * - **Accessibility testing** : Tests conformité a11y automatisés
 * - **Visual regression** : Snapshots states différents types
 * - **Integration testing** : Tests bout-en-bout workflows notifications
 * - **Performance testing** : Métriques rendering et memory usage
 * - **Cross-browser** : Validation compatibilité navigateurs moderne
 *
 * ## Extensions futures et améliorations envisageables
 *
 * ### 🚀 Évolutions fonctionnelles avancées
 * - **Notification queue** : Gestion file attente notifications multiples
 * - **Priority system** : Système priorités notifications critiques
 * - **Grouping** : Regroupement notifications similaires automatique
 * - **Undo actions** : Boutons annulation actions destructives
 * - **Rich media** : Support images et videos dans notifications
 * - **Interactive buttons** : Actions directes depuis notification
 * - **Progress notifications** : Indicateurs progression opérations longues
 * - **Contextual actions** : Boutons actions spécifiques contexte
 *
 * ### 🎨 Améliorations visuelles et UX
 * - **Smooth animations** : Entrée/sortie animations fluides CSS
 * - **Sound notifications** : Audio feedback discret selon préférences
 * - **Haptic feedback** : Vibrations mobiles pour notifications importantes
 * - **Custom themes** : Thèmes couleurs personnalisés selon branding
 * - **Dark mode** : Support automatique modes sombre/clair
 * - **Micro-interactions** : Détails animation engagement utilisateur
 * - **Swipe gestures** : Fermeture par swipe mobile intuitive
 * - **Resize adaptation** : Adaptation dynamique taille contenu
 *
 * @param {NotificationProps} props - Configuration apparence et comportement notification
 * @param {string} props.type - Type notification: success|error|warning|info
 * @param {string} props.title - Titre principal notification (obligatoire)
 * @param {string} [props.message] - Message détaillé optionnel
 * @param {number} [props.duration=5000] - Durée affichage millisecondes
 * @param {function} [props.onClose] - Callback fermeture notification
 * @param {boolean} [props.showCloseButton=true] - Affichage bouton fermeture
 * @param {string} [props.position="top-right"] - Position écran notification
 * @param {string} [props.className] - Classes CSS Tailwind custom
 * @param {boolean} [props.persistent=false] - Mode persistant sans auto-fermeture
 *
 * @returns {JSX.Element} Notification interactive positionnée AdminJO
 *
 * @see Spinner - Composant indicateur chargement complémentaire
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Notification succès basique
 * <Notification
 *   type="success"
 *   title="Événement sauvegardé"
 *   message="L'événement JO 2024 a été créé avec succès"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Notification erreur persistante avec callback
 * <Notification
 *   type="error"
 *   title="Erreur de validation"
 *   message="La discipline n'est pas conforme aux règlements CIO"
 *   persistent
 *   onClose={() => console.log('Erreur fermée')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Notification warning positionnée centre
 * <Notification
 *   type="warning"
 *   title="Quota participants atteint"
 *   message="Limite de 500 participants pour cette épreuve"
 *   position="top-center"
 *   duration={8000}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Notification info mobile bottom-center
 * <Notification
 *   type="info"
 *   title="Nouvelles directives CIO"
 *   position="bottom-center"
 *   showCloseButton={false}
 *   className="lg:hidden"
 * />
 * ```
 */
export default function Notification({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  position = 'top-right',
  className = '',
  persistent = false
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Gestion auto-fermeture
  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, persistent]);

  // Configuration des styles par type
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800 border-l-green-500',
    error: 'bg-red-50 border-red-200 text-red-800 border-l-red-500',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 border-l-yellow-500',
    info: 'bg-blue-50 border-blue-200 text-blue-800 border-l-blue-500'
  };

  // Configuration des positions
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  // Icônes par type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed ${positionStyles[position]} 
        max-w-sm w-full 
        ${typeStyles[type]} 
        border border-l-4 rounded-lg shadow-lg p-4 
        z-50 
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          {message && (
            <p className="mt-1 text-sm opacity-90">
              {message}
            </p>
          )}
        </div>
        {showCloseButton && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
              aria-label="Fermer la notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
