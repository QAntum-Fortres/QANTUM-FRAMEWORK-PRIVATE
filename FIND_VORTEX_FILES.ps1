# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  VORTEX FILE FINDER - Търси всичко свързано с Vortex                       ║
# ║  Автор: Dimitar Prodromov | QAntum Prime                                   ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

$OutputFile = "data\LISTS\VORTEX_FILES_LIST.txt"

Write-Host "`n🌀 VORTEX FILE SCANNER - Starting..." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n"

# Initialize output
$Results = @()
$Results += "╔═══════════════════════════════════════════════════════════════════════════╗"
$Results += "║  🌀 VORTEX EMPIRE - Complete File Inventory                               ║"
$Results += "║  Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')                                       ║"
$Results += "╚═══════════════════════════════════════════════════════════════════════════╝"
$Results += ""

# 1. FOLDERS with VORTEX in name
Write-Host "📁 [1/5] Scanning for VORTEX folders..." -ForegroundColor Yellow
$VortexFolders = Get-ChildItem -Path . -Directory -Recurse -ErrorAction SilentlyContinue | 
Where-Object { $_.Name -match 'vortex' -or $_.Name -match 'VORTEX' }

$Results += "═══════════════════════════════════════════════════════════════"
$Results += "📁 VORTEX DIRECTORIES ($($VortexFolders.Count) found)"
$Results += "═══════════════════════════════════════════════════════════════"
foreach ($folder in $VortexFolders) {
    $subItems = (Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue).Count
    $Results += "  $($folder.FullName.Replace((Get-Location).Path + '\', ''))  [$subItems files]"
}
Write-Host "   Found: $($VortexFolders.Count) folders" -ForegroundColor Green
$Results += ""

# 2. FILES with VORTEX in name
Write-Host "📄 [2/5] Scanning for VORTEX files (by name)..." -ForegroundColor Yellow
$VortexFiles = Get-ChildItem -Path . -File -Recurse -ErrorAction SilentlyContinue | 
Where-Object { $_.Name -match 'vortex' -or $_.Name -match 'VORTEX' }

$Results += "═══════════════════════════════════════════════════════════════"
$Results += "📄 VORTEX FILES BY NAME ($($VortexFiles.Count) found)"
$Results += "═══════════════════════════════════════════════════════════════"
$Results += "Lines  | Path"
$Results += "-------|--------------------------------------------------------"

$TotalLines = 0
foreach ($file in $VortexFiles) {
    if ($file.Extension -match '\.(ts|js|py|ps1|md|json|tsx|jsx)$') {
        try {
            $lines = (Get-Content $file.FullName -ErrorAction SilentlyContinue).Count
            $TotalLines += $lines
            $Results += ("{0,-6} | {1}" -f $lines, $file.FullName.Replace((Get-Location).Path + '\', ''))
        }
        catch {
            $Results += "ERR    | $($file.FullName.Replace((Get-Location).Path + '\', ''))"
        }
    }
}
Write-Host "   Found: $($VortexFiles.Count) files ($TotalLines lines)" -ForegroundColor Green
$Results += ""
$Results += "TOTAL LINES: $TotalLines"
$Results += ""

# 3. TypeScript files CONTAINING "vortex"
Write-Host "🔍 [3/5] Searching for files CONTAINING 'vortex'..." -ForegroundColor Yellow
$FilesWithVortex = @()
$Extensions = @("*.ts", "*.js", "*.tsx", "*.jsx", "*.py", "*.ps1")

foreach ($ext in $Extensions) {
    $files = Get-ChildItem -Path . -Filter $ext -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { (Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue) -match 'vortex|VORTEX|Vortex' }
    $FilesWithVortex += $files
}

$Results += "═══════════════════════════════════════════════════════════════"
$Results += "🔍 FILES CONTAINING 'VORTEX' ($($FilesWithVortex.Count) found)"
$Results += "═══════════════════════════════════════════════════════════════"
foreach ($file in $FilesWithVortex | Select-Object -First 100) {
    $Results += "  $($file.FullName.Replace((Get-Location).Path + '\', ''))"
}
if ($FilesWithVortex.Count -gt 100) {
    $Results += "  ... and $($FilesWithVortex.Count - 100) more files"
}
Write-Host "   Found: $($FilesWithVortex.Count) files containing 'vortex'" -ForegroundColor Green
$Results += ""

# 4. KEY VORTEX MODULES
Write-Host "⚡ [4/5] Identifying KEY Vortex modules..." -ForegroundColor Yellow
$KeyPatterns = @(
    "VortexAI",
    "VortexCore", 
    "VortexEngine",
    "QantumVortex",
    "vortex-console",
    "VortexDaemon",
    "VortexArsenal"
)

$Results += "═══════════════════════════════════════════════════════════════"
$Results += "⚡ KEY VORTEX MODULES"
$Results += "═══════════════════════════════════════════════════════════════"

foreach ($pattern in $KeyPatterns) {
    $matches = Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match $pattern -or $_.FullName -match $pattern }
    if ($matches.Count -gt 0) {
        $Results += "`n  [$pattern] - $($matches.Count) files:"
        foreach ($m in $matches | Select-Object -First 10) {
            $Results += "    → $($m.FullName.Replace((Get-Location).Path + '\', ''))"
        }
    }
}
Write-Host "   Scanned $($KeyPatterns.Count) key patterns" -ForegroundColor Green
$Results += ""

# 5. VORTEX STRUCTURE SUMMARY
Write-Host "📊 [5/5] Building VORTEX structure summary..." -ForegroundColor Yellow
$Results += "═══════════════════════════════════════════════════════════════"
$Results += "📊 VORTEX STRUCTURE SUMMARY"
$Results += "═══════════════════════════════════════════════════════════════"

# Check if QANTUM_VORTEX_CORE exists
$VortexCore = "QANTUM_VORTEX_CORE"
if (Test-Path $VortexCore) {
    $coreFiles = Get-ChildItem -Path $VortexCore -Recurse -File -ErrorAction SilentlyContinue
    $coreLines = 0
    foreach ($f in $coreFiles) {
        if ($f.Extension -match '\.(ts|js|py)$') {
            $coreLines += (Get-Content $f.FullName -ErrorAction SilentlyContinue).Count
        }
    }
    $Results += ""
    $Results += "🎯 QANTUM_VORTEX_CORE:"
    $Results += "   Files: $($coreFiles.Count)"
    $Results += "   Total Lines: $coreLines"
    $Results += "   Contents:"
    Get-ChildItem -Path $VortexCore -Recurse -File | ForEach-Object {
        $Results += "     - $($_.Name)"
    }
}

# Check VORTEX_ARSENAL
$Arsenal = "VORTEX_ARSENAL"
if (Test-Path $Arsenal) {
    $arsenalDirs = Get-ChildItem -Path $Arsenal -Directory
    $Results += ""
    $Results += "🛡️ VORTEX_ARSENAL:"
    $Results += "   Modules: $($arsenalDirs.Count)"
    foreach ($d in $arsenalDirs) {
        $fileCount = (Get-ChildItem -Path $d.FullName -Recurse -File -ErrorAction SilentlyContinue).Count
        $Results += "     📦 $($d.Name) [$fileCount files]"
    }
}

$Results += ""
$Results += "═══════════════════════════════════════════════════════════════"
$Results += "✅ SCAN COMPLETE - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$Results += "═══════════════════════════════════════════════════════════════"

# Save to file
$Results | Out-File -FilePath $OutputFile -Encoding UTF8
Write-Host "`n✅ Results saved to: $OutputFile" -ForegroundColor Green

# Display summary
Write-Host "`n════════════════════════════════════════════════════════════════"
Write-Host "🌀 VORTEX SCAN COMPLETE!" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════"
Write-Host "   📁 Folders: $($VortexFolders.Count)"
Write-Host "   📄 Files (by name): $($VortexFiles.Count)"
Write-Host "   🔍 Files (containing): $($FilesWithVortex.Count)"
Write-Host "   📊 Total LOC: $TotalLines"
Write-Host "════════════════════════════════════════════════════════════════`n"
