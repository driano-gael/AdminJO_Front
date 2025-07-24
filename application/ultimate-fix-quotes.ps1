# Script final pour corriger les apostrophes en utilisant des guillemets doubles
$files = Get-ChildItem -Path "__tests__" -Include "*.test.tsx", "*.test.ts" -Recurse

foreach ($file in $files) {
    Write-Host "Correction finale avec guillemets doubles: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Remplacer toutes les occurrences de it(' par it(" quand il y a des apostrophes françaises
    $content = $content -replace "it\('([^']*d'[^']*)'\s*,\s*\(\)\s*=>\s*\{", "it(`"$1`", () => {"
    $content = $content -replace "describe\('([^']*d'[^']*)'\s*,\s*\(\)\s*=>\s*\{", "describe(`"$1`", () => {"
    
    # Corrections spécifiques
    $content = $content -replace "it\('should display message d'erreur", "it(`"should display message d'erreur"
    $content = $content -replace "it\('should not display message d'erreur", "it(`"should not display message d'erreur"  
    $content = $content -replace "it\('should show message d'erreur", "it(`"should show message d'erreur"
    $content = $content -replace "it\('should render bouton d'", "it(`"should render bouton d'"
    $content = $content -replace "it\('should handle multiple rapid clicks on bouton d'", "it(`"should handle multiple rapid clicks on bouton d'"
    $content = $content -replace "it\('should have correct styling for bouton d'", "it(`"should have correct styling for bouton d'"
    $content = $content -replace "it\('should disable bouton d'", "it(`"should disable bouton d'"
    $content = $content -replace "it\('should call onClose when close bouton est cliqué", "it(`"should call onClose when close bouton est cliqué"
    $content = $content -replace "it\('should have proper alert role for message d'erreurs", "it(`"should have proper alert role for message d'erreurs"
    
    # Corriger les caractères corrompus
    $content = $content -replace "d'Ã©dition", "d'édition"
    $content = $content -replace "cliquÃ©", "cliqué"
    
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline
}

Write-Host "Correction finale avec guillemets doubles terminée!"
