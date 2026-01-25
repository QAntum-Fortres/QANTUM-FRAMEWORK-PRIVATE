$targets = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

$extensions = @("*.md", "LICENSE", "*.json", "*.txt")

Write-Host "Starting Link Repair..." -ForegroundColor Cyan

foreach ($root in $targets) {
    if (-not (Test-Path $root)) { continue }
    
    Get-ChildItem -Path $root -Recurse -Include $extensions | ForEach-Object {
        $file = $_.FullName
        
        if ($file -match "node_modules" -or $file -match "\\.git\\") { return }

        try {
            $content = Get-Content -Raw $file -ErrorAction Stop
        }
        catch { return }

        $original = $content
        $modified = $false

        # Fix the specific double replacement error
        # Pattern observed: https://www.https://www.linkedin.com/in/dimitar-prodromov-1818b3399/-1818b3399/
        # Also possibly: https://www.linkedin.com/in/dimitar-prodromov-1818b3399/-1818b3399/
        
        # We will just strictly force the correct URL for any occurrence of the ID
        if ($content -match "dimitar-prodromov-1818b3399") {
            # Naive but effective: replace the whole messed up line part or regex
            # Let's search for variants and replace with clean URL
             
            # Case 1: Triple/Double http
            $content = $content -replace "https://www\.https://www\.linkedin\.com/in/dimitar-prodromov-1818b3399/-1818b3399/?", "https://www.linkedin.com/in/dimitar-prodromov-1818b3399/"
             
            # Case 2: Double suffix
            $content = $content -replace "linkedin\.com/in/dimitar-prodromov-1818b3399/-1818b3399/?", "linkedin.com/in/dimitar-prodromov-1818b3399/"
             
            # General cleanup: ensure standard prefix
            $content = $content -replace "https://www\.https://", "https://"
        }

        if ($content -ne $original) {
            Write-Host "Repaired: $file" -ForegroundColor Green
            $content | Set-Content -Path $file -NoNewline
        }
    }
}
Write-Host "Link Repair Complete." -ForegroundColor Cyan
