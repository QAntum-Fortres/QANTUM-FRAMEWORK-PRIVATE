$root = "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main"

Write-Host "Cleaning up Vortex Legacy Links..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $root -Recurse -Include "*.md"

foreach ($file in $files) {
    $path = $file.FullName
    if ($path -match "node_modules" -or $path -match "\\.git\\" -or $path -match "ALL_CODE_CONTEXT\.md") { continue }
    
    try { $content = Get-Content -Raw $path -ErrorAction Stop } catch { continue }
    $original = $content
    $modified = $false

    # Replace all papica777-eng GitHub repo links with the new organization
    if ($content -match "github\.com/papica777-eng") {
        # General replacement for all repos
        $content = $content -replace "github\.com/papica777-eng/QA-Framework", "github.com/QAntum-Fortres/QAntum-FRAMEWORK"
        $content = $content -replace "github\.com/papica777-eng/QAntumQATool", "github.com/QAntum-Fortres/QAntum-FRAMEWORK"
        $content = $content -replace "github\.com/papica777-eng/QAntum-Demo", "github.com/QAntum-Fortres/QAntum-FRAMEWORK"
        $content = $content -replace "github\.com/papica777-eng/QAntumPage", "qantum-fortres.github.io/PORTFOLIO"

        # Generic fallback for any remaining papica777-eng links
        $content = $content -replace "papica777-eng/QA-Framework", "QAntum-Fortres/QAntum-FRAMEWORK"
        
        $modified = $true
    }

    if ($modified) {
        Write-Host "Cleaned: $path" -ForegroundColor Green
        $content | Set-Content -Path $path -NoNewline
    }
}
Write-Host "Vortex Link Cleanup Complete." -ForegroundColor Cyan
