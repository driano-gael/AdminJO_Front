/**
 * Composant SearchAndFilters - Barre de recherche des lieux olympiques AdminJO
 *
 * Ce composant fournit l'interface de recherche pour filtrer les lieux olympiques
 * des Jeux Olympiques 2024. Il offre une barre de recherche en temps réel permettant
 * aux administrateurs de localiser rapidement des établissements sportifs spécifiques
 * parmi la liste complète des lieux olympiques (Stade de France, Centre Aquatique,
 * Arena Bercy, etc.). Conçu pour l'efficacité opérationnelle, il suit les standards
 * AdminJO avec feedback visuel immédiat, états de focus optimisés, et intégration
 * harmonieuse dans l'écosystème de gestion des infrastructures olympiques.
 *
 * ## Fonctionnalités de recherche réellement implémentées
 *
 * ### 🔍 Barre de recherche temps réel lieux olympiques
 * - **Input principal** : Champ texte avec placeholder "Rechercher un lieu..."
 * - **Recherche instantanée** : onChange déclenche onSearch(e.target.value)
 * - **Valeur contrôlée** : value={searchTerm} pour synchronisation état
 * - **Pas de debouncing** : Filtrage immédiat sans délai optimisation
 * - **Largeur adaptée** : max-w-md pour taille optimale desktop/mobile
 * - **Responsive design** : w-full avec container flexible
 * - **Terminologie ciblée** : Placeholder spécialisé contexte lieux
 *
 * ### 🎯 États de focus et interaction utilisateur
 * - **Focus ring** : focus:ring-2 focus:ring-blue-500 couleur AdminJO
 * - **Outline désactivé** : focus:outline-none pour style customisé
 * - **Border standard** : border-gray-300 état normal
 * - **Transition focus** : Changement visuel immédiat sur focus
 * - **Zone de clic** : px-4 py-2 pour confort interaction
 * - **Contraste texte** : text-black pour lisibilité optimale
 * - **Accessibilité** : Navigation clavier native input
 *
 * ### 📋 Layout et présentation container
 * - **Container principal** : bg-white rounded-lg shadow-md élévation
 * - **Padding généreux** : p-6 pour respiration composant
 * - **Espacement externe** : mb-8 séparation avec composants suivants
 * - **Container input** : flex-1 max-w-md limitation largeur
 * - **Design cohérent** : Style aligné autres cards AdminJO
 * - **Élévation subtile** : shadow-md pour détachement visuel
 * - **Coins arrondis** : rounded-md harmonisation design system
 *
 * ## Architecture et intégration système lieux
 *
 * ### 🔄 Gestion d'état contrôlé
 * - **Props descendantes** : searchTerm depuis composant parent
 * - **Callbacks ascendants** : onSearch vers LieuxManagement
 * - **Synchronisation** : Valeur input synchronisée avec état global
 * - **Réactivité** : Re-render automatique sur changement searchTerm
 * - **Pas d'état local** : Composant entièrement contrôlé parent
 * - **Performance** : onChange directe sans state intermédiaire
 * - **Consistance** : Source de vérité unique dans parent
 *
 * ### 📡 Communication parent-enfant optimisée
 * - **Interface stricte** : SearchAndFiltersProps avec types TypeScript
 * - **Callback simple** : onSearch(query: string) signature claire
 * - **Transmission immédiate** : Pas de buffer ou délai traitement
 * - **Délégation logique** : Filtrage géré par composant parent
 * - **Isolation responsabilités** : UI pure sans logique métier
 * - **Réutilisabilité** : Pattern générique adaptable autres modules
 * - **Maintenance** : Logique centralisée facilite évolutions
 *
 * ## Expérience utilisateur et ergonomie lieux
 *
 * ### 🎨 Design et feedback visuel
 * - **Placeholder contextuel** : "Rechercher un lieu..." spécialisé
 * - **États visuels clairs** : Normal, focus, disabled bien définis
 * - **Cohérence chromatique** : Couleurs alignées theme AdminJO
 * - **Élévation appropriée** : shadow-md sans surcharge visuelle
 * - **Espacement harmonieux** : Padding et margins équilibrés
 * - **Typography lisible** : text-black contraste optimal
 * - **Border radius** : Coins arrondis pour douceur interface
 *
 * ### ⚡ Performance et réactivité recherche
 * - **Réponse immédiate** : onChange sans debouncing
 * - **Pas de loading** : Filtrage côté client instantané
 * - **Minimal re-renders** : Props stables entre updates
 * - **Légèreté DOM** : Structure HTML minimale
 * - **CSS optimisé** : Classes Tailwind pré-compilées
 * - **Input natif** : Performance navigateur maximale
 * - **Memory efficient** : Pas de state ou refs internes
 *
 * ## Accessibilité et standards d'usage
 *
 * ### ♿ Conformité accessibilité native
 * - **Sémantique HTML** : Input type="text" natif accessible
 * - **Placeholder descriptif** : Information contextuelle claire
 * - **Focus visible** : Ring de focus bien contrasté
 * - **Navigation clavier** : Tab/Shift+Tab support natif
 * - **Screen readers** : Placeholder lu par synthèse vocale
 * - **Contraste suffisant** : text-black sur bg-white optimal
 * - **Zone interaction** : Padding suffisant pour tous usages
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **Label explicite** : <label> associé pour description
 * - **ARIA enhancements** : aria-label contextuel détaillé
 * - **Search role** : role="search" pour identification sémantique
 * - **Live region** : Annonce résultats pour screen readers
 * - **Keyboard shortcuts** : Raccourcis focus rapide (Ctrl+F)
 * - **Clear button** : Bouton effacement accessible
 * - **Status announcements** : Feedback audio nombre résultats
 *
 * ## Responsive design et adaptabilité
 *
 * ### 📱 Adaptation multi-supports
 * - **Container flexible** : flex-1 adaptation largeur parent
 * - **Largeur maximale** : max-w-md évite extension excessive
 * - **Input responsive** : w-full utilise espace disponible
 * - **Padding adaptatif** : p-6 approprié desktop et mobile
 * - **Touch-friendly** : py-2 hauteur suffisante interaction tactile
 * - **Margin responsive** : mb-8 espacement cohérent écrans
 * - **Font-size** : Taille par défaut adaptée tous supports
 *
 * ### 💻 Optimisation expérience desktop
 * - **Largeur contrôlée** : max-w-md évite barre trop étendue
 * - **Hover states** : Potentiel amélioration hover border
 * - **Focus management** : Ring visible pour navigation clavier
 * - **Cursor appropriate** : text cursor dans champ input
 * - **Selection behavior** : Sélection texte native optimisée
 * - **Copy/paste** : Support clipboard navigateur standard
 *
 * ## Contexte métier lieux olympiques spécialisé
 *
 * ### 🏅 Spécificités domaine infrastructure olympique
 * - **Terminologie ciblée** : "lieu" pour établissements sportifs
 * - **Placeholder contextuel** : Recherche spécialisée lieux olympiques
 * - **Cas d'usage** : Localisation rapide parmi établissements JO
 * - **Exemples recherche** : "Stade", "Centre", "Arena", "Aquatique"
 * - **Efficacité opérationnelle** : Tool administrateurs organisateurs
 * - **Volume données** : Optimisé pour catalogue lieux JO 2024
 * - **Précision recherche** : Filtrage par nom établissement
 *
 * ### 📊 Types recherches supportées actuellement
 * - **Recherche nom** : Filtrage par nom lieu (implémentation parent)
 * - **Sensibilité casse** : Dépend implémentation parent
 * - **Recherche partielle** : Matching sous-chaînes probablement
 * - **Caractères spéciaux** : Support accent selon backend
 * - **Recherche vide** : Affichage tous lieux si term vide
 * - **Temps réel** : Résultats instantanés pendant frappe
 *
 * ## Limitations actuelles et améliorations futures
 *
 * ### ❌ Fonctionnalités manquantes actuellement
 * - **Filtres avancés** : Pas de critères supplémentaires (type, capacité)
 * - **Suggestions** : Pas d'autocomplétion pendant frappe
 * - **Recherche floue** : Pas de tolérance erreurs frappe
 * - **Raccourcis clavier** : Pas de shortcuts focus rapide
 * - **Historique** : Pas de mémorisation recherches récentes
 * - **Clear button** : Pas de bouton effacement visible
 * - **Advanced search** : Pas de critères multiples combinés
 *
 * ### 🚀 Évolutions possibles module recherche lieux
 * - **Filtres contextuels** : Type lieu (stade/centre/arena)
 * - **Autocomplétion** : Suggestions basées noms existants
 * - **Recherche géographique** : Filtrage par zone géographique
 * - **Capacité filtres** : Recherche par jauge établissement
 * - **Statut filters** : Disponible/maintenance/construction
 * - **Favoris** : Marquage lieux consultés fréquemment
 * - **Export recherche** : Sauvegarde résultats filtrage
 * - **Search analytics** : Statistiques termes recherchés
 * - **Voice search** : Recherche vocale pour accessibilité
 * - **QR code scan** : Recherche par scan code lieu physique
 *
 * ### 🔧 Améliorations techniques UX
 * - **Debouncing intelligent** : Optimisation performance grandes listes
 * - **Loading states** : Indicateur pendant recherche lente
 * - **Error handling** : Gestion échec recherche réseau
 * - **Cache search** : Mise en cache résultats fréquents
 * - **Infinite scroll** : Pagination résultats recherche
 * - **Highlighting** : Surlignage termes dans résultats
 * - **Search operators** : AND/OR/NOT pour recherches complexes
 * - **RegEx support** : Patterns avancés pour power users
 *
 * ## Intégration écosystème AdminJO
 *
 * ### 🔗 Position dans architecture lieux
 * - **Parent direct** : LieuxManagement orchestrateur principal
 * - **Siblings** : LieuxTable, LieuxHeader composants frères
 * - **Position layout** : Entre header et tableau pour UX logique
 * - **Style cohérent** : bg-white shadow-md aligné autres cards
 * - **Espacement** : mb-8 séparation harmonieuse composants
 * - **Integration fluide** : Transition visuelle naturelle
 *
 * ### 📱 Réutilisabilité cross-modules
 * - **Pattern générique** : Adaptable disciplines, épreuves, événements
 * - **Props interface** : Contrat réutilisable autres contextes
 * - **Style modulaire** : Classes Tailwind transposables
 * - **Logic agnostic** : Pas de logique spécifique lieux hardcodée
 * - **Customization** : Placeholder modifiable selon contexte
 * - **Maintenance centralisée** : Évolutions bénéficient tous modules
 *
 * @param {SearchAndFiltersProps} props - Propriétés composant recherche lieux
 * @param {string} props.searchTerm - Terme recherche actuel synchronisé
 * @param {function} props.onSearch - Callback changement terme recherche
 *
 * @returns {JSX.Element} Interface recherche lieux olympiques temps réel
 *
 * @see {@link LieuxManagement} - Composant parent orchestrateur
 * @see {@link LieuxTable} - Composant tableau utilisant filtrage
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * <SearchAndFilters
 *   searchTerm={currentSearchTerm}
 *   onSearch={(term) => setSearchTerm(term)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Intégration avec hook gestion lieux
 * const { searchTerm, handleSearch } = useLieuxManagement();
 *
 * <SearchAndFilters
 *   searchTerm={searchTerm}
 *   onSearch={handleSearch}
 * />
 * ```
 */
interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
}

export default function SearchAndFilters({ searchTerm, onSearch }: SearchAndFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Rechercher un lieu..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
