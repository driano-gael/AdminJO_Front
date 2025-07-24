# Script de traduction automatique des tests en français
# Chemin vers le dossier des tests
$testPath = "__tests__"

# Dictionnaire de traduction des termes courants
$translations = @{
    "should" = "devrait"
    "should not" = "ne devrait pas"
    "should be" = "devrait être"
    "should have" = "devrait avoir"
    "should render" = "devrait afficher"
    "should display" = "devrait afficher"
    "should call" = "devrait appeler"
    "should update" = "devrait mettre à jour"
    "should handle" = "devrait gérer"
    "should show" = "devrait montrer"
    "should hide" = "devrait masquer"
    "should open" = "devrait ouvrir"
    "should close" = "devrait fermer"
    "should create" = "devrait créer"
    "should delete" = "devrait supprimer"
    "should edit" = "devrait modifier"
    "should save" = "devrait sauvegarder"
    "should validate" = "devrait valider"
    "should filter" = "devrait filtrer"
    "should search" = "devrait rechercher"
    "should load" = "devrait charger"
    "should navigate" = "devrait naviguer"
    "should toggle" = "devrait basculer"
    "should enable" = "devrait activer"
    "should disable" = "devrait désactiver"
    "should contain" = "devrait contenir"
    "should match" = "devrait correspondre"
    "should trigger" = "devrait déclencher"
    "when" = "quand"
    "with" = "avec"
    "without" = "sans"
    "on click" = "au clic"
    "on change" = "au changement"
    "on submit" = "à la soumission"
    "on mount" = "au montage"
    "on load" = "au chargement"
    "when clicked" = "quand cliqué"
    "when changed" = "quand modifié"
    "when submitted" = "quand soumis"
    "when loaded" = "quand chargé"
    "when provided" = "quand fourni"
    "when empty" = "quand vide"
    "when valid" = "quand valide"
    "when invalid" = "quand invalide"
    "Initial Render" = "Rendu Initial"
    "Component Rendering" = "Rendu du Composant"
    "User Interactions" = "Interactions Utilisateur"
    "Form Validation" = "Validation du Formulaire"
    "API Integration" = "Intégration API"
    "Error Handling" = "Gestion des Erreurs"
    "Loading State" = "État de Chargement"
    "Search Functionality" = "Fonctionnalité de Recherche"
    "Filter Functionality" = "Fonctionnalité de Filtrage"
    "Modal Behavior" = "Comportement du Modal"
    "Navigation" = "Navigation"
    "Authentication" = "Authentification"
    "Button Interactions" = "Interactions des Boutons"
    "Form Submission" = "Soumission du Formulaire"
    "Data Loading" = "Chargement des Données"
    "Event Handling" = "Gestion des Événements"
}

# Dictionnaire pour les noms de describe()
$describeTranslations = @{
    "Modal Visibility" = "Visibilité du Modal"
    "Form Fields" = "Champs du Formulaire"
    "Button Interaction" = "Interaction des Boutons"
    "Loading State" = "État de Chargement"
    "API Data Loading" = "Chargement des Données API"
    "Form Interactions" = "Interactions du Formulaire"
    "Error Handling" = "Gestion des Erreurs"
    "Search Functionality" = "Fonctionnalité de Recherche"
    "Filter Operations" = "Opérations de Filtrage"
    "CRUD Operations" = "Opérations CRUD"
    "Data Display" = "Affichage des Données"
    "User Interface" = "Interface Utilisateur"
    "Component State" = "État du Composant"
    "Props Handling" = "Gestion des Props"
    "Event Callbacks" = "Callbacks d'Événements"
    "Validation Logic" = "Logique de Validation"
    "Component Lifecycle" = "Cycle de Vie du Composant"
    "Conditional Rendering" = "Rendu Conditionnel"
    "Table Operations" = "Opérations de Tableau"
    "Modal Operations" = "Opérations de Modal"
    "Navigation Behavior" = "Comportement de Navigation"
    "Authentication Flow" = "Flux d'Authentification"
}

function Translate-TestString {
    param($inputString)
    
    $result = $inputString
    
    # Traduction des describe() et it()
    foreach ($key in $translations.Keys) {
        $result = $result -replace [regex]::Escape($key), $translations[$key]
    }
    
    foreach ($key in $describeTranslations.Keys) {
        $result = $result -replace [regex]::Escape($key), $describeTranslations[$key]
    }
    
    return $result
}

# Obtenir tous les fichiers de test
$testFiles = Get-ChildItem -Path $testPath -Include "*.test.tsx" -Recurse

Write-Host "Trouvé $($testFiles.Count) fichiers de test à traduire..."

foreach ($file in $testFiles) {
    Write-Host "Traitement de: $($file.FullName)"
    
    # Lire le contenu du fichier
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Faire une sauvegarde
    $backupPath = $file.FullName + ".backup"
    Copy-Item $file.FullName $backupPath
    
    # Remplacer les chaînes de test courantes
    $translatedContent = $content
    
    # Traduire les describe() et it() avec des expressions régulières
    $translatedContent = $translatedContent -replace "describe\('([^']+)',", {
        param($match)
        $originalText = $match.Groups[1].Value
        $translatedText = Translate-TestString $originalText
        return "describe('$translatedText',"
    }
    
    $translatedContent = $translatedContent -replace "it\('([^']+)',", {
        param($match)
        $originalText = $match.Groups[1].Value
        $translatedText = Translate-TestString $originalText
        return "it('$translatedText',"
    }
    
    # Écrire le contenu traduit
    $translatedContent | Set-Content $file.FullName -Encoding UTF8
}

Write-Host "Traduction terminée!"
Write-Host "Les fichiers de sauvegarde sont créés avec l'extension .backup"
