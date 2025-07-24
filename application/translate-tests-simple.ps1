# Script de traduction simple et sûr pour les tests
$files = Get-ChildItem -Path "__tests__" -Include "*.test.tsx" -Recurse

$replacements = @(
    @{ From = "describe\('Modal Visibility',"; To = "describe('Visibilité du Modal'," }
    @{ From = "describe\('Form Fields',"; To = "describe('Champs du Formulaire'," }
    @{ From = "describe\('Button Interaction',"; To = "describe('Interaction des Boutons'," }
    @{ From = "describe\('Loading State',"; To = "describe('État de Chargement'," }
    @{ From = "describe\('API Data Loading',"; To = "describe('Chargement des Données API'," }
    @{ From = "describe\('Form Interactions',"; To = "describe('Interactions du Formulaire'," }
    @{ From = "describe\('Error Handling',"; To = "describe('Gestion des Erreurs'," }
    @{ From = "describe\('Initial Render',"; To = "describe('Rendu Initial'," }
    @{ From = "describe\('Component Rendering',"; To = "describe('Rendu du Composant'," }
    @{ From = "describe\('User Interactions',"; To = "describe('Interactions Utilisateur'," }
    @{ From = "describe\('Form Validation',"; To = "describe('Validation du Formulaire'," }
    @{ From = "describe\('API Integration',"; To = "describe('Intégration API'," }
    @{ From = "describe\('Search Functionality',"; To = "describe('Fonctionnalité de Recherche'," }
    @{ From = "describe\('Filter Functionality',"; To = "describe('Fonctionnalité de Filtrage'," }
    @{ From = "describe\('Modal Behavior',"; To = "describe('Comportement du Modal'," }
    @{ From = "describe\('Navigation',"; To = "describe('Navigation'," }
    @{ From = "describe\('Authentication',"; To = "describe('Authentification'," }
    @{ From = "describe\('CRUD Operations',"; To = "describe('Opérations CRUD'," }
    @{ From = "describe\('Data Display',"; To = "describe('Affichage des Données'," }
    @{ From = "describe\('Component State',"; To = "describe('État du Composant'," }
    
    # IT translations
    @{ From = "it\('should render"; To = "it('devrait afficher" }
    @{ From = "it\('should display"; To = "it('devrait afficher" }
    @{ From = "it\('should call"; To = "it('devrait appeler" }
    @{ From = "it\('should update"; To = "it('devrait mettre à jour" }
    @{ From = "it\('should handle"; To = "it('devrait gérer" }
    @{ From = "it\('should show"; To = "it('devrait montrer" }
    @{ From = "it\('should hide"; To = "it('devrait masquer" }
    @{ From = "it\('should open"; To = "it('devrait ouvrir" }
    @{ From = "it\('should close"; To = "it('devrait fermer" }
    @{ From = "it\('should create"; To = "it('devrait créer" }
    @{ From = "it\('should delete"; To = "it('devrait supprimer" }
    @{ From = "it\('should edit"; To = "it('devrait modifier" }
    @{ From = "it\('should save"; To = "it('devrait sauvegarder" }
    @{ From = "it\('should validate"; To = "it('devrait valider" }
    @{ From = "it\('should filter"; To = "it('devrait filtrer" }
    @{ From = "it\('should search"; To = "it('devrait rechercher" }
    @{ From = "it\('should load"; To = "it('devrait charger" }
    @{ From = "it\('should navigate"; To = "it('devrait naviguer" }
    @{ From = "it\('should toggle"; To = "it('devrait basculer" }
    @{ From = "it\('should enable"; To = "it('devrait activer" }
    @{ From = "it\('should disable"; To = "it('devrait désactiver" }
    @{ From = "it\('should contain"; To = "it('devrait contenir" }
    @{ From = "it\('should match"; To = "it('devrait correspondre" }
    @{ From = "it\('should trigger"; To = "it('devrait déclencher" }
    @{ From = "it\('should not render"; To = "it('ne devrait pas afficher" }
    @{ From = "it\('should not display"; To = "it('ne devrait pas afficher" }
    @{ From = "it\('should not call"; To = "it('ne devrait pas appeler" }
    @{ From = "it\('should not show"; To = "it('ne devrait pas montrer" }
)

foreach ($file in $files) {
    Write-Host "Traitement: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement.From), $replacement.To
    }
    
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline
}

Write-Host "Traduction terminée!"
