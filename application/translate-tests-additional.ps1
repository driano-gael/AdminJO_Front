# Script de traduction supplémentaire pour des phrases plus complexes
$files = Get-ChildItem -Path "__tests__" -Include "*.test.tsx" -Recurse

$additionalReplacements = @(
    # Phrases complètes courantes
    @{ From = " when clicked"; To = " quand cliqué" }
    @{ From = " when changed"; To = " quand modifié" }
    @{ From = " when submitted"; To = " quand soumis" }
    @{ From = " when loaded"; To = " quand chargé" }
    @{ From = " when provided"; To = " quand fourni" }
    @{ From = " when empty"; To = " quand vide" }
    @{ From = " when valid"; To = " quand valide" }
    @{ From = " when invalid"; To = " quand invalide" }
    @{ From = " with valid data"; To = " avec des données valides" }
    @{ From = " with invalid data"; To = " avec des données invalides" }
    @{ From = " with empty form"; To = " avec un formulaire vide" }
    @{ From = " on click"; To = " au clic" }
    @{ From = " on change"; To = " au changement" }
    @{ From = " on submit"; To = " à la soumission" }
    @{ From = " on mount"; To = " au montage" }
    @{ From = " on load"; To = " au chargement" }
    @{ From = " is disabled"; To = " est désactivé" }
    @{ From = " is enabled"; To = " est activé" }
    @{ From = " is visible"; To = " est visible" }
    @{ From = " is hidden"; To = " est masqué" }
    @{ From = " correctly"; To = " correctement" }
    @{ From = " properly"; To = " correctement" }
    @{ From = " successfully"; To = " avec succès" }
    @{ From = " by default"; To = " par défaut" }
    @{ From = " as expected"; To = " comme attendu" }
    @{ From = " in the document"; To = " dans le document" }
    @{ From = " in the DOM"; To = " dans le DOM" }
    @{ From = " to be called"; To = " être appelé" }
    @{ From = " to be visible"; To = " être visible" }
    @{ From = " to be disabled"; To = " être désactivé" }
    @{ From = " to be enabled"; To = " être activé" }
    @{ From = " button is clicked"; To = " bouton est cliqué" }
    @{ From = " field is changed"; To = " champ est modifié" }
    @{ From = " form is submitted"; To = " formulaire est soumis" }
    @{ From = " component is mounted"; To = " composant est monté" }
    @{ From = " data is loaded"; To = " données sont chargées" }
    @{ From = " error occurs"; To = " erreur se produit" }
    @{ From = " loading is complete"; To = " chargement est terminé" }
    @{ From = " user input"; To = " saisie utilisateur" }
    @{ From = " user interaction"; To = " interaction utilisateur" }
    @{ From = " user clicks"; To = " utilisateur clique" }
    @{ From = " user types"; To = " utilisateur tape" }
    @{ From = " user selects"; To = " utilisateur sélectionne" }
    @{ From = " modal is open"; To = " modal est ouvert" }
    @{ From = " modal is closed"; To = " modal est fermé" }
    @{ From = " table row"; To = " ligne de tableau" }
    @{ From = " search query"; To = " requête de recherche" }
    @{ From = " filter option"; To = " option de filtre" }
    @{ From = " dropdown menu"; To = " menu déroulant" }
    @{ From = " input field"; To = " champ de saisie" }
    @{ From = " submit button"; To = " bouton de soumission" }
    @{ From = " cancel button"; To = " bouton d'annulation" }
    @{ From = " create button"; To = " bouton de création" }
    @{ From = " edit button"; To = " bouton d'édition" }
    @{ From = " delete button"; To = " bouton de suppression" }
    @{ From = " save button"; To = " bouton de sauvegarde" }
    @{ From = " back button"; To = " bouton de retour" }
    @{ From = " next button"; To = " bouton suivant" }
    @{ From = " previous button"; To = " bouton précédent" }
    @{ From = " close button"; To = " bouton de fermeture" }
    @{ From = " loading spinner"; To = " indicateur de chargement" }
    @{ From = " error message"; To = " message d'erreur" }
    @{ From = " success message"; To = " message de succès" }
    @{ From = " warning message"; To = " message d'avertissement" }
    @{ From = " info message"; To = " message d'information" }
    @{ From = " notification"; To = " notification" }
    @{ From = " validation error"; To = " erreur de validation" }
    @{ From = " required field"; To = " champ obligatoire" }
    @{ From = " optional field"; To = " champ optionnel" }
)

foreach ($file in $files) {
    Write-Host "Traitement supplémentaire: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    foreach ($replacement in $additionalReplacements) {
        $content = $content -replace [regex]::Escape($replacement.From), $replacement.To
    }
    
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline
}

Write-Host "Traduction supplémentaire terminée!"
