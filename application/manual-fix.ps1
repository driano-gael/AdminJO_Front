# Script manuel pour corriger les erreurs d'apostrophes restantes
$errorFiles = @(
    "__tests__/components/componentsEvenement/discipline/DisciplineModal.test.tsx",
    "__tests__/components/componentsEvenement/discipline/DisciplinesTable.test.tsx", 
    "__tests__/components/componentsEvenement/discipline/DisciplinesTableRow.test.tsx",
    "__tests__/components/componentsEvenement/epreuve/EpreuveModal.test.tsx",
    "__tests__/components/componentsEvenement/epreuve/EpreuvesTable.test.tsx",
    "__tests__/components/componentsEvenement/epreuve/EpreuvesTableRow.test.tsx",
    "__tests__/components/componentsEvenement/evenements/EvenementsTable.test.tsx",
    "__tests__/components/componentsEvenement/evenements/EvenementsTableRow.test.tsx",
    "__tests__/components/componentsEvenement/lieux/LieuModal.test.tsx",
    "__tests__/components/componentsEvenement/lieux/LieuxTable.test.tsx",
    "__tests__/components/componentsEvenement/lieux/LieuxTableRow.test.tsx"
)

foreach ($filePath in $errorFiles) {
    if (Test-Path $filePath) {
        Write-Host "Correction manuelle: $filePath"
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Corrections spécifiques pour chaque type d'erreur
        $content = $content -replace "it\('([^']*message d'erreur[^']*)', \(\) => \{", 'it("$1", () => {'
        $content = $content -replace "it\('([^']*bouton d'[^']*)', \(\) => \{", 'it("$1", () => {'
        $content = $content -replace "screen\.getByText\('([^']*d'erreur[^']*)'\)", 'screen.getByText("$1")'
        $content = $content -replace 'error="([^"]*d\'erreur[^"]*)"', 'error="$1"'
        
        # Corrections pour les caractères corrompus
        $content = $content -replace "d'Ã©dition", "d'édition"
        $content = $content -replace "cliquÃ©", "cliqué"
        
        $content | Set-Content $filePath -Encoding UTF8 -NoNewline
    }
}

Write-Host "Correction manuelle terminée!"
