# 🔥 GOD-LEVEL SAAS AUTO-INTEGRATOR
# Automatically integrates ALL high-priority modules into QA-SAAS
# NO MANUAL WORK - Full automation with conflict resolution

param(
    [string]$SourceRoot = $PSScriptRoot,
    [string]$TargetSaasPath = "c:\Users\papic\source\repos\papica777-eng\QA-SAAS",
    [switch]$DryRun = $false,
    [switch]$Force = $false,
    [string[]]$Priorities = @("HIGH", "MEDIUM")
)

$ErrorActionPreference = "Stop"

Write-Host "🔥 GOD-LEVEL SAAS AUTO-INTEGRATOR" -ForegroundColor Cyan
Write-Host "=" * 100
Write-Host ""

if ($DryRun) {
    Write-Host "⚠️  DRY RUN MODE - No files will be copied" -ForegroundColor Yellow
    Write-Host ""
}

# Check if QA-SAAS exists
if (-not (Test-Path $TargetSaasPath)) {
    Write-Host "❌ QA-SAAS not found at: $TargetSaasPath" -ForegroundColor Red
    Write-Host "Creating directory structure..." -ForegroundColor Yellow
    New-Item -Path $TargetSaasPath -ItemType Directory -Force | Out-Null
}

# Load analysis JSON
$analysisPath = Join-Path $SourceRoot "SAAS_MODULE_ANALYSIS.json"
if (-not (Test-Path $analysisPath)) {
    Write-Host "❌ SAAS_MODULE_ANALYSIS.json not found!" -ForegroundColor Red
    Write-Host "Run ANALYZE_SAAS_MODULES.ps1 first!" -ForegroundColor Yellow
    exit 1
}

$modules = Get-Content $analysisPath -Encoding UTF8 | ConvertFrom-Json

# Filter by priority
$targetModules = $modules | Where-Object { $_.Priority -in $Priorities -and $_.SaasSuitable }

Write-Host "📊 INTEGRATION PLAN:" -ForegroundColor Yellow
Write-Host "Source: $SourceRoot" -ForegroundColor White
Write-Host "Target: $TargetSaasPath" -ForegroundColor White
Write-Host "Modules to integrate: $($targetModules.Count)" -ForegroundColor Cyan
Write-Host ""

# Category mapping to target directories
$categoryMapping = @{
    "💰 Revenue Generation - Direct monetization" = "src/revenue"
    "🔐 Licensing - SaaS business model"          = "src/licensing"
    "🔥 Core Logic - Decision making engine"      = "src/logic"
    "🐝 Multi-tenant - Agent coordination"        = "src/agents"
    "📊 Analytics - Customer insights"            = "src/analytics"
    "💾 Data Layer - Multi-tenant storage"        = "src/database"
    "🛡️ Security - Data protection"              = "src/security"
    "🌐 API - External integration"               = "src/api"
    "🧠 AI Features - Competitive advantage"      = "src/ai"
    "🌍 Localization - Global reach"              = "src/localization"
    "⚠️ Error Handling - Reliability"             = "src/errors"
    "🎨 UI/UX - User experience"                  = "src/ui"
}

# Statistics
$stats = @{
    Copied             = 0
    Skipped            = 0
    Errors             = 0
    TotalLOC           = 0
    DuplicatesResolved = 0
}

$copiedFiles = @()
$errorFiles = @()

# Group modules by filename to detect duplicates
$modulesByName = $targetModules | Group-Object FileName

Write-Host "🚀 STARTING AUTO-INTEGRATION..." -ForegroundColor Green
Write-Host ""

foreach ($group in $modulesByName) {
    $fileName = $group.Name
    $instances = $group.Group
    
    if ($instances.Count -gt 1) {
        Write-Host "🔍 DUPLICATE DETECTED: $fileName ($($instances.Count) copies)" -ForegroundColor Yellow
        
        # Smart duplicate resolution: prefer specific paths
        $preferred = $instances | Where-Object { 
            $_.Path -match 'VORTEX_ARSENAL\\CRYPTO_VAULT' -or 
            $_.Path -match 'QAntum-Fortres-7' -or
            $_.Path -match 'src\\GAMMA_INFRA'
        } | Select-Object -First 1
        
        if (-not $preferred) {
            # Fallback: highest LOC
            $preferred = $instances | Sort-Object LOC -Descending | Select-Object -First 1
        }
        
        Write-Host "   ✅ Selected: $($preferred.Path) ($($preferred.LOC) LOC)" -ForegroundColor Green
        $moduleToProcess = $preferred
        $stats.DuplicatesResolved += $instances.Count - 1
    }
    else {
        $moduleToProcess = $instances[0]
    }
    
    # Determine target directory
    $targetDir = "src/modules"  # Default
    foreach ($key in $categoryMapping.Keys) {
        if ($moduleToProcess.Reason -eq $key) {
            $targetDir = $categoryMapping[$key]
            break
        }
    }
    
    $targetFullDir = Join-Path $TargetSaasPath $targetDir
    $targetFilePath = Join-Path $targetFullDir $fileName
    
    # Find source file
    $sourcePath = Join-Path $SourceRoot $moduleToProcess.Path
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "⚠️  Source not found: $fileName" -ForegroundColor Yellow
        Write-Host "   Searching..." -ForegroundColor Gray
        
        # Deep search
        $found = Get-ChildItem -Path $SourceRoot -Recurse -Filter $fileName -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch 'node_modules|\.git' } |
        Select-Object -First 1
        
        if ($found) {
            $sourcePath = $found.FullName
            Write-Host "   ✅ Found: $($sourcePath.Replace($SourceRoot, '.'))" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ Not found: $fileName" -ForegroundColor Red
            $stats.Errors++
            $errorFiles += $fileName
            continue
        }
    }
    
    # Copy file
    if (-not $DryRun) {
        New-Item -Path $targetFullDir -ItemType Directory -Force | Out-Null
        
        if ((Test-Path $targetFilePath) -and -not $Force) {
            Write-Host "⏭️  SKIP: $fileName (already exists, use -Force to overwrite)" -ForegroundColor Gray
            $stats.Skipped++
        }
        else {
            try {
                Copy-Item -Path $sourcePath -Destination $targetFilePath -Force
                Write-Host "✅ COPIED: $fileName ($($moduleToProcess.LOC) LOC)" -ForegroundColor Green
                Write-Host "   → $targetDir\" -ForegroundColor DarkGray
                $stats.Copied++
                $stats.TotalLOC += $moduleToProcess.LOC
                
                $copiedFiles += [PSCustomObject]@{
                    FileName   = $fileName
                    LOC        = $moduleToProcess.LOC
                    Category   = $targetDir
                    Reason     = $moduleToProcess.Reason
                    SourcePath = $sourcePath.Replace($SourceRoot, ".")
                }
            }
            catch {
                Write-Host "❌ ERROR: $fileName - $($_.Exception.Message)" -ForegroundColor Red
                $stats.Errors++
                $errorFiles += $fileName
            }
        }
    }
    else {
        Write-Host "🔍 WOULD COPY: $fileName → $targetDir\" -ForegroundColor Cyan
        $stats.Copied++
        $stats.TotalLOC += $moduleToProcess.LOC
    }
}

Write-Host ""
Write-Host "=" * 100
Write-Host "📊 INTEGRATION COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "Statistics:" -ForegroundColor Yellow
Write-Host "  ✅ Copied: $($stats.Copied) modules" -ForegroundColor Green
Write-Host "  📦 Total LOC: $($stats.TotalLOC.ToString('N0'))" -ForegroundColor Cyan
Write-Host "  🔄 Duplicates resolved: $($stats.DuplicatesResolved)" -ForegroundColor Yellow
Write-Host "  ⏭️  Skipped: $($stats.Skipped)" -ForegroundColor Gray
Write-Host "  ❌ Errors: $($stats.Errors)" -ForegroundColor Red
Write-Host ""

if ($errorFiles.Count -gt 0) {
    Write-Host "⚠️  Files with errors:" -ForegroundColor Red
    $errorFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor DarkRed }
    Write-Host ""
}

# Generate integration report
if (-not $DryRun -and $stats.Copied -gt 0) {
    $reportPath = Join-Path $TargetSaasPath "INTEGRATION_REPORT.md"
    $report = @"
# 🚀 AUTO-INTEGRATION REPORT

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Modules Integrated:** $($stats.Copied)  
**Total LOC Added:** $($stats.TotalLOC.ToString('N0'))

---

## 📦 Integrated Modules

"@

    $byCategory = $copiedFiles | Group-Object Category | Sort-Object Name
    foreach ($cat in $byCategory) {
        $report += "`n### $($cat.Name) ($($cat.Count) modules)`n`n"
        foreach ($file in $cat.Group | Sort-Object LOC -Descending) {
            $report += "- ✅ **$($file.FileName)** ($($file.LOC) LOC)`n"
            $report += "  - $($file.Reason)`n"
        }
        $report += "`n"
    }
    
    $report += @"

---

## 🔄 Next Steps

1. **Update imports** - Run import fixer
2. **Install dependencies** - Check for missing packages
3. **Run tests** - Verify integration
4. **Update docs** - Document new features

---

## 📊 Statistics by Category

| Category | Modules | Total LOC |
|----------|---------|-----------|
"@

    foreach ($cat in $byCategory) {
        $totalCatLOC = ($cat.Group | Measure-Object -Property LOC -Sum).Sum
        $report += "`n| $($cat.Name) | $($cat.Count) | $($totalCatLOC.ToString('N0')) |"
    }
    
    $report | Out-File $reportPath -Encoding UTF8
    Write-Host "✅ Integration report: $reportPath" -ForegroundColor Green
    Write-Host ""
}

# Auto-generate index files
if (-not $DryRun -and $stats.Copied -gt 0) {
    Write-Host "🔧 GENERATING INDEX FILES..." -ForegroundColor Cyan
    
    $byCategory = $copiedFiles | Group-Object Category
    foreach ($cat in $byCategory) {
        $indexPath = Join-Path $TargetSaasPath $cat.Name "index.ts"
        $indexContent = "// Auto-generated index file`n// Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`n"
        
        foreach ($file in $cat.Group | Sort-Object FileName) {
            $moduleName = [System.IO.Path]::GetFileNameWithoutExtension($file.FileName)
            $indexContent += "export * from './$moduleName';`n"
        }
        
        New-Item -Path (Split-Path $indexPath) -ItemType Directory -Force | Out-Null
        $indexContent | Out-File $indexPath -Encoding UTF8
        Write-Host "  ✅ Created: $($cat.Name)/index.ts" -ForegroundColor Green
    }
    Write-Host ""
}

# Create main integration manifest
if (-not $DryRun -and $stats.Copied -gt 0) {
    $manifestPath = Join-Path $TargetSaasPath "saas-modules.manifest.json"
    $manifest = @{
        generatedAt  = (Get-Date -Format "o")
        version      = "1.0.0"
        totalModules = $stats.Copied
        totalLOC     = $stats.TotalLOC
        modules      = $copiedFiles | ForEach-Object {
            @{
                fileName   = $_.FileName
                loc        = $_.LOC
                category   = $_.Category
                reason     = $_.Reason
                sourcePath = $_.SourcePath
            }
        }
    }
    
    $manifest | ConvertTo-Json -Depth 10 | Out-File $manifestPath -Encoding UTF8
    Write-Host "✅ Manifest created: saas-modules.manifest.json" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎉 INTEGRATION SUCCESSFUL!" -ForegroundColor Green
Write-Host ""
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "  cd $TargetSaasPath" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run build" -ForegroundColor White
Write-Host "  npm test" -ForegroundColor White
Write-Host ""
Write-Host "🔥 QA-SAAS is now GOD-TIER ready!" -ForegroundColor Red
