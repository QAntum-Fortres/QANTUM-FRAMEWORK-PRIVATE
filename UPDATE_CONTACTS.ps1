$targets = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

$extensions = @("*.md", "LICENSE", "*.json", "*.txt")

Write-Host "Starting Global Contact Info Update..." -ForegroundColor Cyan

foreach ($root in $targets) {
    if (-not (Test-Path $root)) { continue }
    
    Write-Host "Scanning $root..." -ForegroundColor Yellow

    Get-ChildItem -Path $root -Recurse -Include $extensions | ForEach-Object {
        $file = $_.FullName
        
        # Skip node_modules and .git
        if ($file -match "node_modules" -or $file -match "\\.git\\") { return }

        try {
            $content = Get-Content -Raw $file -ErrorAction Stop
        }
        catch {
            Write-Warning "Could not read $file"
            return
        }

        $original = $content
        $modified = $false

        # 1. Replace LinkedIn (Handle various formats)
        if ($content -match "linkedin\.com/in/dimitar-prodromov") {
            # Avoid replacing if already correct (simple check)
            if (-not ($content -match "1818b3399")) {
                $content = $content -replace "https?://(www\.)?linkedin\.com/in/dimitar-prodromov\)?", "https://www.linkedin.com/in/dimitar-prodromov-1818b3399/"
                $content = $content -replace "linkedin\.com/in/dimitar-prodromov", "https://www.linkedin.com/in/dimitar-prodromov-1818b3399/"
                $modified = $true
            }
        }

        # 2. Replace Email
        if ($content -match "dimitar\.prodromov@qantum\.dev") {
            $content = $content -replace "dimitar\.prodromov@qantum\.dev", "prodromovd@gmail.com"
            $modified = $true
        }
        if ($content -match "security@qantum\.dev") {
            $content = $content -replace "security@qantum\.dev", "prodromovd@gmail.com"
            $modified = $true
        }

        # 3. Add Phone Number (if not present)
        # We look for the Email line and append Phone after it
        if ($content -match "prodromovd@gmail.com" -and $content -notmatch "359896849882") {
            if ($file -match "\.md$") {
                # Regex to find the email line (bullet point or bold)
                # Pattern: - 📧 Email: <prodromovd@gmail.com>
                if ($content -match "(?m)^.*📧.*prodromovd@gmail\.com.*$") {
                    $content = $content -replace "(?m)^(.*📧.*prodromovd@gmail\.com.*)$", "`$1`r`n- 📞 Phone: +359 89 684 9882 (Bulgaria)"
                    $modified = $true
                }
                # Pattern: **Contact:** <prodromovd@gmail.com>
                elseif ($content -match "(?m)^.*Contact:.*prodromovd@gmail\.com.*$") {
                    $content = $content -replace "(?m)^(.*Contact:.*prodromovd@gmail\.com.*)$", "`$1`r`n**Phone:** +359 89 684 9882 (Bulgaria)"
                    $modified = $true
                }
            }
            elseif ($file -match "LICENSE") {
                if ($content -match "Contact: prodromovd@gmail.com") {
                    $content = $content -replace "Contact: prodromovd@gmail.com", "Contact: prodromovd@gmail.com`r`nPhone: +359 89 684 9882 (Bulgaria)"
                    $modified = $true
                }
            }
        }

        if ($modified) {
            Write-Host "Updating: $file" -ForegroundColor Green
            $content | Set-Content -Path $file -NoNewline
        }
    }
}

Write-Host "Global Update Complete." -ForegroundColor Cyan
