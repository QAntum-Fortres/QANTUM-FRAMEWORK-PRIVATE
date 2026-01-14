$targets = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

$extensions = @("*.md")

Write-Host "Starting Markdown Link Fix..." -ForegroundColor Cyan

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

        # Fix missing closing parenthesis for LinkedIn links
        # Pattern: ](https://www.linkedin.com/in/dimitar-prodromov-1818b3399/ followed by EOF or newline or space, but NO closing paren
        
        # We'll just targetedly replace the exact string without ')' with one WITH ')'
        # Be careful not to double add if we run twice
        
        if ($content -match "\]\(https://www\.linkedin\.com/in/dimitar-prodromov-1818b3399/") {
            # Replace strictly if it DOESN'T have a )
            # Using a lookahead or just replacing the known bad pattern
             
            # Case: End of line
            $content = $content -replace "\]\(https://www\.linkedin\.com/in/dimitar-prodromov-1818b3399/(\s*)$", "](https://www.linkedin.com/in/dimitar-prodromov-1818b3399/)$1"
             
            # Case: Middle of text (unlikely for this list but possible)
            # If it is followed by not-a-paren matches
             
            # Simpler approach: Replace the URL with URL)
            # But first remove any existing ) to clean state? No, that breaks correct ones.
             
            # Let's count parens? No.
             
            # Let's look for known bad suffix.
            # In the previous view it ended the line.
             
            # Check if we have `1818b3399/` followed by NEWLINE
            if ($content -match "1818b3399/`r?`n") {
                $content = $content -replace "1818b3399/(`r?`n)", "1818b3399/)$1"
                $modified = $true
            }
        }

        if ($content -ne $original) {
            Write-Host "Fixed MD Links: $file" -ForegroundColor Green
            $content | Set-Content -Path $file -NoNewline
        }
    }
}
Write-Host "Markdown LInk Fix Complete." -ForegroundColor Cyan
