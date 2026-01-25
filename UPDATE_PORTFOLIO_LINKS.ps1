$targets = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

$targetLink = "https://qantum-fortres.github.io/PORTFOLIO/"
$extensions = @("*.md", "*.html", "*.txt") # Include html for the job assets if needed

Write-Host "Starting Global Portfolio Link Update..." -ForegroundColor Cyan

foreach ($root in $targets) {
    if (-not (Test-Path $root)) { continue }
    
    Get-ChildItem -Path $root -Recurse -Include $extensions | ForEach-Object {
        $file = $_.FullName
        if ($file -match "node_modules" -or $file -match "\\.git\\") { return }
        
        try { $content = Get-Content -Raw $file -ErrorAction Stop } catch { return }
        $original = $content
        $modified = $false

        # Pattern 1: Framework Link
        if ($content -match "qantum-fortres\.github\.io/QAntum-FRAMEWORK/?") {
            $content = $content -replace "https?://qantum-fortres\.github\.io/QAntum-FRAMEWORK/?", $targetLink
            $modified = $true
        }

        # Pattern 2: SaaS Link
        if ($content -match "qantum-fortres\.github\.io/QAntum-SaaS-Platform/?") {
            $content = $content -replace "https?://qantum-fortres\.github\.io/QAntum-SaaS-Platform/?", $targetLink
            $modified = $true
        }

        # Pattern 3: Old/Wrong lowercase or other variations
        # Avoid replacing the target link itself if it's already there
        # But we want to standardize everything. 
        
        if ($content -match "qantum-fortres\.github\.io/QA-SAAS/?") {
            $content = $content -replace "https?://qantum-fortres\.github\.io/QA-SAAS/?", $targetLink
            $modified = $true
        }

        if ($modified) {
            Write-Host "Updated Link in: $file" -ForegroundColor Green
            $content | Set-Content -Path $file -NoNewline
        }
    }
}
Write-Host "Portfolio Link Update Complete." -ForegroundColor Cyan
