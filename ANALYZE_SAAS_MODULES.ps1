# 🎯 SAAS MODULE ANALYZER - All modules >= 900 LOC
# Analyzes which modules are suitable for QA-SAAS platform

param(
    [int]$MinLines = 900
)

Write-Host "🎯 ANALYZING MODULES FOR QA-SAAS (>= $MinLines LOC)..." -ForegroundColor Cyan
Write-Host ""

$listPath = Join-Path $PSScriptRoot "data\LISTS\HEAVY_SCRIPTS_LIST.txt"

if (-not (Test-Path $listPath)) {
    Write-Host "❌ File not found: $listPath" -ForegroundColor Red
    exit 1
}

# Read with UTF-16 LE encoding
$content = Get-Content $listPath -Encoding Unicode
$modules = @()

foreach ($line in $content) {
    # Parse: "1583   | path/to/file.ts"
    if ($line -match '^\s*(\d+)\s*\|\s*(.+)$') {
        $loc = [int]$matches[1]
        $filePath = $matches[2].Trim()
        
        if ($loc -ge $MinLines) {
            $fileName = Split-Path $filePath -Leaf
            
            # SAAS Suitability Analysis
            $saasSuitable = $false
            $saasReason = ""
            $priority = "LOW"
            
            # HIGH PRIORITY - Core SaaS functionality
            if ($fileName -match 'logic|meta|onto|reasoning') {
                $saasSuitable = $true
                $saasReason = "🔥 Core Logic - Decision making engine"
                $priority = "HIGH"
            }
            elseif ($fileName -match 'arbitrage|revenue|sales|profit|market') {
                $saasSuitable = $true
                $saasReason = "💰 Revenue Generation - Direct monetization"
                $priority = "HIGH"
            }
            elseif ($fileName -match 'license|auth|subscription|payment') {
                $saasSuitable = $true
                $saasReason = "🔐 Licensing - SaaS business model"
                $priority = "HIGH"
            }
            
            # MEDIUM PRIORITY - Important infrastructure
            elseif ($fileName -match 'swarm|orchestrator|coordinator|mesh|nexus') {
                $saasSuitable = $true
                $saasReason = "🐝 Multi-tenant - Agent coordination"
                $priority = "MEDIUM"
            }
            elseif ($fileName -match 'dashboard|report|analytics|metrics|monitor') {
                $saasSuitable = $true
                $saasReason = "📊 Analytics - Customer insights"
                $priority = "MEDIUM"
            }
            elseif ($fileName -match 'database|storage|cache|persistence') {
                $saasSuitable = $true
                $saasReason = "💾 Data Layer - Multi-tenant storage"
                $priority = "MEDIUM"
            }
            elseif ($fileName -match 'api|gateway|router|endpoint') {
                $saasSuitable = $true
                $saasReason = "🌐 API - External integration"
                $priority = "MEDIUM"
            }
            elseif ($fileName -match 'security|vault|encryption|shield|ghost') {
                $saasSuitable = $true
                $saasReason = "🛡️ Security - Data protection"
                $priority = "MEDIUM"
            }
            
            # LOW PRIORITY - Nice to have
            elseif ($fileName -match 'neural|ai|intelligence|brain|cognitive') {
                $saasSuitable = $true
                $saasReason = "🧠 AI Features - Competitive advantage"
                $priority = "LOW"
            }
            elseif ($fileName -match 'i18n|translate|locale|lang') {
                $saasSuitable = $true
                $saasReason = "🌍 Localization - Global reach"
                $priority = "LOW"
            }
            elseif ($fileName -match 'error|exception|handler|recovery') {
                $saasSuitable = $true
                $saasReason = "⚠️ Error Handling - Reliability"
                $priority = "LOW"
            }
            elseif ($fileName -match 'ui|ux|hud|interface|component') {
                $saasSuitable = $true
                $saasReason = "🎨 UI/UX - User experience"
                $priority = "LOW"
            }
            
            # NOT SUITABLE - Testing/dev tools
            elseif ($fileName -match 'test|spec|mock|stub|fixture') {
                $saasSuitable = $false
                $saasReason = "🧪 Testing - Dev tool only"
                $priority = "SKIP"
            }
            elseif ($fileName -match 'debug|trace|profiler') {
                $saasSuitable = $false
                $saasReason = "🐛 Debug Tool - Not production"
                $priority = "SKIP"
            }
            else {
                $saasSuitable = $false
                $saasReason = "❓ Unknown - Needs review"
                $priority = "REVIEW"
            }
            
            $modules += [PSCustomObject]@{
                LOC          = $loc
                FileName     = $fileName
                Path         = $filePath
                SaasSuitable = $saasSuitable
                Reason       = $saasReason
                Priority     = $priority
            }
        }
    }
}

# Sort by priority then LOC
$priorityOrder = @{ 'HIGH' = 1; 'MEDIUM' = 2; 'LOW' = 3; 'REVIEW' = 4; 'SKIP' = 5 }
$modules = $modules | Sort-Object { $priorityOrder[$_.Priority] }, { - $_.LOC }

# Statistics
$total = $modules.Count
$suitable = ($modules | Where-Object { $_.SaasSuitable }).Count
$high = ($modules | Where-Object { $_.Priority -eq 'HIGH' }).Count
$medium = ($modules | Where-Object { $_.Priority -eq 'MEDIUM' }).Count
$low = ($modules | Where-Object { $_.Priority -eq 'LOW' }).Count
$review = ($modules | Where-Object { $_.Priority -eq 'REVIEW' }).Count
$skip = ($modules | Where-Object { $_.Priority -eq 'SKIP' }).Count

Write-Host "📊 SUMMARY:" -ForegroundColor Yellow
Write-Host "=" * 100
Write-Host "Total modules >= $MinLines LOC: $total" -ForegroundColor White
Write-Host "SaaS Suitable: $suitable ($([math]::Round($suitable/$total*100, 1))%)" -ForegroundColor Green
Write-Host ""
Write-Host "  🔥 HIGH Priority:   $high modules" -ForegroundColor Red
Write-Host "  📦 MEDIUM Priority: $medium modules" -ForegroundColor Yellow
Write-Host "  📄 LOW Priority:    $low modules" -ForegroundColor Cyan
Write-Host "  ❓ REVIEW Needed:   $review modules" -ForegroundColor Magenta
Write-Host "  ⏭️  SKIP (Tests):    $skip modules" -ForegroundColor Gray
Write-Host ""
Write-Host ""

# HIGH PRIORITY
Write-Host "🔥 HIGH PRIORITY - COPY TO SAAS IMMEDIATELY:" -ForegroundColor Red
Write-Host "=" * 100
$highMods = $modules | Where-Object { $_.Priority -eq 'HIGH' }
$rank = 1
foreach ($mod in $highMods) {
    Write-Host "#$rank | $($mod.LOC) LOC | $($mod.FileName)" -ForegroundColor Red
    Write-Host "     → $($mod.Reason)" -ForegroundColor White
    Write-Host "     Path: $($mod.Path)" -ForegroundColor DarkGray
    Write-Host ""
    $rank++
}

# MEDIUM PRIORITY
Write-Host ""
Write-Host "📦 MEDIUM PRIORITY - INTEGRATE AFTER HIGH:" -ForegroundColor Yellow
Write-Host "=" * 100
$mediumMods = $modules | Where-Object { $_.Priority -eq 'MEDIUM' }
$rank = 1
foreach ($mod in $mediumMods) {
    Write-Host "#$rank | $($mod.LOC) LOC | $($mod.FileName)" -ForegroundColor Yellow
    Write-Host "     → $($mod.Reason)" -ForegroundColor White
    Write-Host ""
    $rank++
}

# LOW PRIORITY
Write-Host ""
Write-Host "📄 LOW PRIORITY - NICE TO HAVE:" -ForegroundColor Cyan
Write-Host "=" * 100
$lowMods = $modules | Where-Object { $_.Priority -eq 'LOW' }
$rank = 1
foreach ($mod in $lowMods) {
    Write-Host "#$rank | $($mod.LOC) LOC | $($mod.FileName)" -ForegroundColor Cyan
    Write-Host "     → $($mod.Reason)" -ForegroundColor White
    Write-Host ""
    $rank++
}

# REVIEW
if ($review -gt 0) {
    Write-Host ""
    Write-Host "❓ NEEDS MANUAL REVIEW:" -ForegroundColor Magenta
    Write-Host "=" * 100
    $reviewMods = $modules | Where-Object { $_.Priority -eq 'REVIEW' }
    foreach ($mod in $reviewMods) {
        Write-Host "$($mod.LOC) LOC | $($mod.FileName)" -ForegroundColor Magenta
        Write-Host "     Path: $($mod.Path)" -ForegroundColor DarkGray
        Write-Host ""
    }
}

# Export to JSON
$exportPath = Join-Path $PSScriptRoot "SAAS_MODULE_ANALYSIS.json"
$modules | ConvertTo-Json -Depth 10 | Out-File $exportPath -Encoding UTF8
Write-Host ""
Write-Host "✅ Analysis exported to: SAAS_MODULE_ANALYSIS.json" -ForegroundColor Green

# Create integration checklist
$checklistPath = Join-Path $PSScriptRoot "SAAS_INTEGRATION_CHECKLIST.md"
$checklist = @"
# 🎯 QA-SAAS MODULE INTEGRATION CHECKLIST

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Modules Analyzed:** $total (>= $MinLines LOC)  
**SaaS Suitable:** $suitable modules

---

## 🔥 HIGH PRIORITY (Copy Immediately)

"@

foreach ($mod in $highMods) {
    $checklist += @"

### [ ] $($mod.FileName) ($($mod.LOC) LOC)
- **Reason:** $($mod.Reason)
- **Source:** ``$($mod.Path)``
- **Target:** ``QA-SAAS/src/[appropriate-dir]/$($mod.FileName)``

"@
}

$checklist += @"

---

## 📦 MEDIUM PRIORITY (Integrate After High)

"@

foreach ($mod in $mediumMods) {
    $checklist += @"

### [ ] $($mod.FileName) ($($mod.LOC) LOC)
- **Reason:** $($mod.Reason)

"@
}

$checklist += @"

---

## 📄 LOW PRIORITY (Nice to Have)

"@

foreach ($mod in $lowMods) {
    $checklist += "- [ ] $($mod.FileName) ($($mod.LOC) LOC) - $($mod.Reason)`n"
}

$checklist | Out-File $checklistPath -Encoding UTF8
Write-Host "✅ Checklist created: SAAS_INTEGRATION_CHECKLIST.md" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Review HIGH priority modules (automatic copy recommended)" -ForegroundColor White
Write-Host "  2. Copy modules to QA-SAAS/$($highMods.Count) high + $($mediumMods.Count) medium)" -ForegroundColor White
Write-Host "  3. Update imports and dependencies" -ForegroundColor White
Write-Host "  4. Run tests and verify integration" -ForegroundColor White
Write-Host "  5. Update QA-SAAS documentation" -ForegroundColor White
Write-Host ""
