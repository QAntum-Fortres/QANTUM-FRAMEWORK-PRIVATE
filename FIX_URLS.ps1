$targets = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

Write-Host "Correcting GitHub Pages URLs..." -ForegroundColor Cyan

foreach ($root in $targets) {
    if (-not (Test-Path $root)) { continue }
    
    Get-ChildItem -Path $root -Recurse -Include "README.md", "README.bg.md" | ForEach-Object {
        $file = $_.FullName
        if ($file -match "node_modules" -or $file -match "\\.git\\") { return }
        
        try { $content = Get-Content -Raw $file -ErrorAction Stop } catch { return }
        $original = $content
        $modified = $false

        # FrameWork URL Fix
        # Correct: https://qantum-fortres.github.io/QAntum-FRAMEWORK/
        # Check if it was something else or confirm casing
        # (It was likely correct, but let's re-force it to be sure)
        
        # SaaS URL Fix
        # Wrong: https://qantum-fortres.github.io/QA-SAAS/
        # Correct: https://qantum-fortres.github.io/QAntum-SaaS-Platform/
        
        if ($content -match "qantum-fortres\.github\.io/QA-SAAS") {
            $content = $content -replace "qantum-fortres\.github\.io/QA-SAAS", "qantum-fortres.github.io/QAntum-SaaS-Platform"
            $modified = $true
        }

        # Also generic check for "QA-SAAS" in the link text vs repo name
        
        if ($modified) {
            Write-Host "Fixed URL in: $file" -ForegroundColor Green
            $content | Set-Content -Path $file -NoNewline
        }
    }
}
Write-Host "URL Correction Complete." -ForegroundColor Cyan
