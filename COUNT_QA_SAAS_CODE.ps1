# Count total code in QA-SAAS project

$qaSaasPath = "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"

Write-Host ""
Write-Host "🔥 QA-SAAS TOTAL CODE STATISTICS" -ForegroundColor Cyan
Write-Host "=" * 100
Write-Host ""

# Get all code files
$files = Get-ChildItem -Path $qaSaasPath -Recurse -Include *.ts, *.js, *.tsx, *.jsx -ErrorAction SilentlyContinue |
Where-Object { 
    $_.FullName -notmatch 'node_modules' -and 
    $_.FullName -notmatch '\.git' -and
    $_.FullName -notmatch 'dist[\\/]' -and
    $_.FullName -notmatch 'build[\\/]' -and
    $_.FullName -notmatch '\.next[\\/]'
}

$totalLines = 0
$totalFiles = 0
$fileDetails = @()

foreach ($file in $files) {
    $lines = (Get-Content $file.FullName -ErrorAction SilentlyContinue).Count
    if ($lines) {
        $totalLines += $lines
        $totalFiles++
        
        $fileDetails += [PSCustomObject]@{
            Path      = $file.FullName.Replace($qaSaasPath, ".")
            Extension = $file.Extension
            Lines     = $lines
        }
    }
}

Write-Host "📁 Path: $qaSaasPath" -ForegroundColor White
Write-Host ""
Write-Host "📊 TOTAL STATISTICS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Total Files: $totalFiles" -ForegroundColor Cyan
Write-Host "  Total Lines of Code: $($totalLines.ToString('N0'))" -ForegroundColor Green
Write-Host ""

# Breakdown by extension
Write-Host "📋 BREAKDOWN BY FILE TYPE:" -ForegroundColor Yellow
Write-Host ""

$byExt = $fileDetails | Group-Object Extension | Sort-Object Count -Descending

foreach ($ext in $byExt) {
    $extLines = ($ext.Group | Measure-Object -Property Lines -Sum).Sum
    $avgLines = [math]::Round($extLines / $ext.Count, 0)
    Write-Host "  $($ext.Name.PadRight(6)) : $($ext.Count.ToString().PadLeft(5)) files | $($extLines.ToString('N0').PadLeft(12)) LOC | avg $($avgLines.ToString('N0')) LOC/file" -ForegroundColor White
}

Write-Host ""

# Top 20 largest files
Write-Host "🏆 TOP 20 LARGEST FILES:" -ForegroundColor Yellow
Write-Host ""

$top20 = $fileDetails | Sort-Object Lines -Descending | Select-Object -First 20
$rank = 1
foreach ($file in $top20) {
    $fileName = Split-Path $file.Path -Leaf
    Write-Host "  #$($rank.ToString().PadLeft(2)) | $($file.Lines.ToString('N0').PadLeft(6)) LOC | $fileName" -ForegroundColor Cyan
    $rank++
}

Write-Host ""

# Recently integrated modules
Write-Host "✅ RECENTLY INTEGRATED (Auto-Integration):" -ForegroundColor Green
Write-Host ""

$newModules = @(
    "MarketBlueprint.ts",
    "SelfHealingSales.ts",
    "AutonomousSalesForce.ts",
    "ProfitOptimizer.ts",
    "MarketplaceConnector.ts",
    "ArbitrageLogic.ts",
    "OntoGenerator.ts",
    "TranscendenceCore.ts",
    "MisteMind_brain_logic_strength_TranscendenceCore.ts",
    "logic-discovery.ts",
    "MetaLogicEngine.ts",
    "ZeroKnowledgeLicense.ts"
)

$newModulesLOC = 0
foreach ($modName in $newModules) {
    $mod = $fileDetails | Where-Object { $_.Path -like "*$modName" } | Select-Object -First 1
    if ($mod) {
        Write-Host "  ✅ $($modName.PadRight(60)) | $($mod.Lines.ToString('N0').PadLeft(6)) LOC" -ForegroundColor Green
        $newModulesLOC += $mod.Lines
    }
}

Write-Host ""
Write-Host "  New Modules Total: $($newModulesLOC.ToString('N0')) LOC added!" -ForegroundColor Cyan
Write-Host ""

# Category breakdown
Write-Host "📦 CODE BY CATEGORY:" -ForegroundColor Yellow
Write-Host ""

$categories = @(
    @{ Name = "src/revenue"; Pattern = "\\src\\revenue\\" },
    @{ Name = "src/logic"; Pattern = "\\src\\logic\\" },
    @{ Name = "src/licensing"; Pattern = "\\src\\licensing\\" },
    @{ Name = "src/agents"; Pattern = "\\src\\agents\\" },
    @{ Name = "src/security"; Pattern = "\\src\\security\\" },
    @{ Name = "src/ai"; Pattern = "\\src\\ai\\" },
    @{ Name = "src/database"; Pattern = "\\src\\database\\" },
    @{ Name = "src/core"; Pattern = "\\src\\core\\" },
    @{ Name = "brain"; Pattern = "\\brain\\" }
)

foreach ($cat in $categories) {
    $catFiles = $fileDetails | Where-Object { $_.Path -match $cat.Pattern }
    if ($catFiles) {
        $catLOC = ($catFiles | Measure-Object -Property Lines -Sum).Sum
        $catCount = $catFiles.Count
        Write-Host "  $($cat.Name.PadRight(25)) : $($catCount.ToString().PadLeft(4)) files | $($catLOC.ToString('N0').PadLeft(10)) LOC" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=" * 100
Write-Host "🎉 QA-SAAS is now a $($totalLines.ToString('N0')) LOC GOD-TIER platform!" -ForegroundColor Red
Write-Host ""
