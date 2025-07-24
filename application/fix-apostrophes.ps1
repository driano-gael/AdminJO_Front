# Script pour corriger les apostrophes françaises qui causent des erreurs de syntaxe
$files = Get-ChildItem -Path "__tests__" -Include "*.test.tsx" -Recurse

$fixes = @(
    # Corriger les apostrophes françaises qui cassent JavaScript
    @{ From = "message d'erreur"; To = "message d'erreur" }
    @{ From = "bouton d'édition"; To = "bouton d'édition" }
    @{ From = "bouton d'annulation"; To = "bouton d'annulation" }
    @{ From = "message d'erreurs"; To = "message d'erreurs" }
    @{ From = "bouton d'Ã©dition"; To = "bouton d'édition" }
    @{ From = "cliquÃ©"; To = "cliqué" }
)

foreach ($file in $files) {
    Write-Host "Correction des apostrophes: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    foreach ($fix in $fixes) {
        $content = $content -replace [regex]::Escape($fix.From), $fix.To
    }
    
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline
}

Write-Host "Correction des apostrophes terminée!"
