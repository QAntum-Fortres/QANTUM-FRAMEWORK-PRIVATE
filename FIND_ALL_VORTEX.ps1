#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════════════════════════════
# 🌪️ VORTEX MEGA FINDER - Find EVERYTHING related to VORTEX
# ═══════════════════════════════════════════════════════════════════════════
# Searches ENTIRE disk + Git history for ALL VORTEX references
# Author: QAntum-Fortres
# Date: 2026-01-14
# ═══════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

Write-Host @"

╔════════════════════════════════════════════════════════════════════════╗
║                   🌪️  VORTEX MEGA FINDER 🌪️                          ║
║                    Finding ALL VORTEX Data                             ║
╚════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 SEARCH PATTERNS
# ═══════════════════════════════════════════════════════════════════════════

$vortexPatterns = @(
    "VORTEX",
    "Vortex",
    "vortex",
    "QAntumVortex",
    "QAntum.*Vortex",
    "VORTEX_CORE",
    "VORTEX_ENCYCLOPEDIA",
    "VORTEX_BLUEPRINT",
    "VortexEngine",
    "VortexSystem"
)

$searchRoots = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos",
    "c:\Users\papic\Desktop"
)

$results = @{
    Files          = @()
    GitCommits     = @()
    Folders        = @()
    CodeReferences = @()
    TotalMatches   = 0
}

# ═══════════════════════════════════════════════════════════════════════════
# 📁 PHASE 1: Find VORTEX Files & Folders
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "`n[1/4] 🔍 Searching for VORTEX files and folders..." -ForegroundColor Yellow

foreach ($root in $searchRoots) {
    if (Test-Path $root) {
        Write-Host "  📂 Scanning: $root" -ForegroundColor Gray
        
        # Find folders
        try {
            $folders = Get-ChildItem -Path $root -Directory -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match "VORTEX|Vortex|vortex" }
            
            foreach ($folder in $folders) {
                $results.Folders += [PSCustomObject]@{
                    Path = $folder.FullName
                    Name = $folder.Name
                    Type = "Folder"
                    Size = (Get-ChildItem $folder.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                }
                $results.TotalMatches++
            }
        }
        catch {}
        
        # Find files
        try {
            $files = Get-ChildItem -Path $root -File -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match "VORTEX|Vortex|vortex" }
            
            foreach ($file in $files) {
                $results.Files += [PSCustomObject]@{
                    Path      = $file.FullName
                    Name      = $file.Name
                    Type      = "File"
                    Size      = $file.Length
                    Extension = $file.Extension
                }
                $results.TotalMatches++
            }
        }
        catch {}
    }
}

Write-Host "  ✅ Found $($results.Folders.Count) folders, $($results.Files.Count) files" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════
# 💾 PHASE 2: Search File Contents for VORTEX
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "`n[2/4] 📄 Searching file contents for VORTEX references..." -ForegroundColor Yellow

$contentExtensions = @("*.ts", "*.js", "*.json", "*.md", "*.txt", "*.yml", "*.yaml", "*.html", "*.css")

foreach ($root in $searchRoots) {
    if (Test-Path $root) {
        foreach ($ext in $contentExtensions) {
            try {
                $contentFiles = Get-ChildItem -Path $root -Filter $ext -File -Recurse -ErrorAction SilentlyContinue
                
                foreach ($file in $contentFiles) {
                    try {
                        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
                        
                        foreach ($pattern in $vortexPatterns) {
                            if ($content -match $pattern) {
                                $matches = ([regex]::Matches($content, $pattern)).Count
                                
                                $results.CodeReferences += [PSCustomObject]@{
                                    File    = $file.FullName
                                    Pattern = $pattern
                                    Matches = $matches
                                    Size    = $file.Length
                                }
                                break  # Don't double-count same file
                            }
                        }
                    }
                    catch {}
                }
            }
            catch {}
        }
    }
}

Write-Host "  ✅ Found VORTEX in $($results.CodeReferences.Count) files" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════
# 🔱 PHASE 3: Search Git History for VORTEX
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "`n[3/4] 🔱 Searching Git history for VORTEX commits..." -ForegroundColor Yellow

$gitRoots = @(
    "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main",
    "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
)

foreach ($gitRoot in $gitRoots) {
    if (Test-Path "$gitRoot\.git") {
        Write-Host "  🔱 Checking Git in: $gitRoot" -ForegroundColor Gray
        
        try {
            Push-Location $gitRoot
            
            # Search commit messages
            $commits = git log --all --grep="VORTEX\|Vortex\|vortex" --pretty=format:"%H|%an|%ae|%ad|%s" 2>$null
            
            if ($commits) {
                foreach ($commit in $commits) {
                    $parts = $commit -split '\|'
                    if ($parts.Count -eq 5) {
                        $results.GitCommits += [PSCustomObject]@{
                            Repo    = $gitRoot
                            Hash    = $parts[0]
                            Author  = $parts[1]
                            Email   = $parts[2]
                            Date    = $parts[3]
                            Message = $parts[4]
                        }
                    }
                }
            }
            
            Pop-Location
        }
        catch {
            if (Test-Path (Get-Location)) {
                Pop-Location
            }
        }
    }
}

Write-Host "  ✅ Found $($results.GitCommits.Count) Git commits with VORTEX" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════
# 📊 PHASE 4: Generate Report
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "`n[4/4] 📊 Generating comprehensive report..." -ForegroundColor Yellow

$reportPath = "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main\VORTEX_FINDER_REPORT.json"
$mdReportPath = "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main\VORTEX_FINDER_REPORT.md"

# Save JSON
$results | ConvertTo-Json -Depth 10 | Out-File $reportPath -Encoding UTF8

# Generate Markdown Report
$mdReport = @"
# 🌪️ VORTEX MEGA FINDER REPORT

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

## 📊 Summary

| Category | Count |
|----------|-------|
| 📁 Folders | $($results.Folders.Count) |
| 📄 Files (names) | $($results.Files.Count) |
| 💾 Code References | $($results.CodeReferences.Count) |
| 🔱 Git Commits | $($results.GitCommits.Count) |
| **🎯 Total Matches** | **$($results.TotalMatches + $results.CodeReferences.Count + $results.GitCommits.Count)** |

---

## 📁 VORTEX Folders

"@

if ($results.Folders.Count -gt 0) {
    $mdReport += "`n| Path | Size |`n|------|------|`n"
    foreach ($folder in $results.Folders | Sort-Object Path) {
        $sizeStr = if ($folder.Size) { "{0:N0} bytes" -f $folder.Size } else { "N/A" }
        $mdReport += "| ``$($folder.Path)`` | $sizeStr |`n"
    }
}
else {
    $mdReport += "`n*No VORTEX folders found.*`n"
}

$mdReport += @"

---

## 📄 VORTEX Files (by name)

"@

if ($results.Files.Count -gt 0) {
    $mdReport += "`n| File | Size | Extension |`n|------|------|-----------|`n"
    foreach ($file in $results.Files | Sort-Object Path) {
        $sizeStr = "{0:N0} bytes" -f $file.Size
        $mdReport += "| ``$($file.Path)`` | $sizeStr | $($file.Extension) |`n"
    }
}
else {
    $mdReport += "`n*No VORTEX-named files found.*`n"
}

$mdReport += @"

---

## 💾 VORTEX Code References

"@

if ($results.CodeReferences.Count -gt 0) {
    $mdReport += "`n| File | Pattern | Matches |`n|------|---------|---------|`n"
    foreach ($ref in $results.CodeReferences | Sort-Object File) {
        $mdReport += "| ``$($ref.File)`` | ``$($ref.Pattern)`` | $($ref.Matches) |`n"
    }
}
else {
    $mdReport += "`n*No VORTEX content references found.*`n"
}

$mdReport += @"

---

## 🔱 Git Commits with VORTEX

"@

if ($results.GitCommits.Count -gt 0) {
    $mdReport += "`n| Date | Author | Message | Hash |`n|------|--------|---------|------|`n"
    foreach ($commit in $results.GitCommits | Sort-Object Date -Descending) {
        $shortHash = $commit.Hash.Substring(0, 8)
        $mdReport += "| $($commit.Date) | $($commit.Author) | $($commit.Message) | ``$shortHash`` |`n"
    }
}
else {
    $mdReport += "`n*No VORTEX Git commits found.*`n"
}

$mdReport += @"

---

## 🎯 Search Configuration

**Search Roots:**
"@

foreach ($root in $searchRoots) {
    $mdReport += "`n- ``$root``"
}

$mdReport += "`n`n**Patterns Searched:**`n"
foreach ($pattern in $vortexPatterns) {
    $mdReport += "- ``$pattern```n"
}

$mdReport | Out-File $mdReportPath -Encoding UTF8

# ═══════════════════════════════════════════════════════════════════════════
# 🎉 FINAL SUMMARY
# ═══════════════════════════════════════════════════════════════════════════

Write-Host @"

╔════════════════════════════════════════════════════════════════════════╗
║                      🌪️  SEARCH COMPLETE 🌪️                          ║
╚════════════════════════════════════════════════════════════════════════╝

📊 RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁 VORTEX Folders:          $($results.Folders.Count)
  📄 VORTEX Files (name):     $($results.Files.Count)
  💾 Code References:         $($results.CodeReferences.Count)
  🔱 Git Commits:             $($results.GitCommits.Count)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 TOTAL MATCHES:           $($results.TotalMatches + $results.CodeReferences.Count + $results.GitCommits.Count)

📄 Reports Generated:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 JSON:  $reportPath
  📝 MD:    $mdReportPath

"@ -ForegroundColor Green

Write-Host "✅ All VORTEX data catalogued successfully!" -ForegroundColor Cyan
Write-Host ""
