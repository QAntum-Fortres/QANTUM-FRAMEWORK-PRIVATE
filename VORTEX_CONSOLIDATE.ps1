# ═══════════════════════════════════════════════════════════════════════════════
# 🌀 VORTEX ENTERPRISE CONSOLIDATION SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════
# © 2025-2026 Dimitar Prodromov. All Rights Reserved.
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"
$ProjectRoot = $PSScriptRoot

Write-Host @"

╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   🌀 VORTEX ENTERPRISE - FINAL CONSOLIDATION                                  ║
║                                                                               ║
║   Moving files to correct locations, cleaning duplicates, preparing for Git  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: CLEAN DUPLICATES
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 1: Cleaning duplicate files..." -ForegroundColor Yellow

$duplicatesRemoved = 0
$duplicatePatterns = @("*_DUPLICATE_*")

foreach ($pattern in $duplicatePatterns) {
    $duplicates = Get-ChildItem -Path $ProjectRoot -Recurse -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($dup in $duplicates) {
        Write-Host "   🗑️ Removing: $($dup.Name)" -ForegroundColor DarkGray
        Remove-Item $dup.FullName -Force -ErrorAction SilentlyContinue
        $duplicatesRemoved++
    }
}

Write-Host "   ✅ Removed $duplicatesRemoved duplicate files" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: ORGANIZE KEY DIRECTORIES
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 2: Organizing key directories..." -ForegroundColor Yellow

# Create core directories if they don't exist
$coreDirs = @(
    "src/core/brain",
    "src/core/memory",
    "src/core/engines",
    "src/core/intelligence",
    "src/core/generators",
    "src/core/console",
    "QANTUM_VORTEX_CORE",
    "docs/enterprise",
    "docs/architecture",
    "scripts/cli"
)

foreach ($dir in $coreDirs) {
    $fullPath = Join-Path $ProjectRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
        Write-Host "   📁 Created: $dir" -ForegroundColor DarkCyan
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: MOVE KEY CLI SCRIPTS
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 3: Moving CLI scripts..." -ForegroundColor Yellow

$cliScripts = @{
    "ALL_SCRIPTS_COLLECTION/fortress-swarm-cli.js" = "scripts/cli/fortress-swarm-cli.js"
    "ALL_SCRIPTS_COLLECTION/hacker-cli.js"         = "scripts/cli/hacker-cli.js"
    "ALL_SCRIPTS_COLLECTION/qantum-cli.js"         = "scripts/cli/qantum-cli.js"
    "ALL_SCRIPTS_COLLECTION/cognitive-cli.js"      = "scripts/cli/cognitive-cli.js"
    "ALL_SCRIPTS_COLLECTION/qantum-daemon.js"      = "scripts/cli/qantum-daemon.js"
}

$movedCli = 0
foreach ($src in $cliScripts.Keys) {
    $srcPath = Join-Path $ProjectRoot $src
    $dstPath = Join-Path $ProjectRoot $cliScripts[$src]
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $dstPath -Force
        Write-Host "   ✓ Moved: $src -> $($cliScripts[$src])" -ForegroundColor Green
        $movedCli++
    }
}

Write-Host "   ✅ Moved $movedCli CLI scripts" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: CONSOLIDATE INTELLIGENCE MODULES
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 4: Consolidating INTELLIGENCE modules..." -ForegroundColor Yellow

$intelligenceDir = Join-Path $ProjectRoot "INTELLIGENCE"
$targetIntelDir = Join-Path $ProjectRoot "src/core/intelligence"

if (Test-Path $intelligenceDir) {
    $coreIntelFiles = @(
        "NeuralInference.ts",
        "BrainRouter.ts",
        "HiveMind.ts",
        "GeminiBrain.ts",
        "neural-optimizer.ts",
        "NeuralOptimizer.ts"
    )
    
    foreach ($file in $coreIntelFiles) {
        $srcPath = Join-Path $intelligenceDir $file
        if (Test-Path $srcPath) {
            Copy-Item -Path $srcPath -Destination $targetIntelDir -Force
            Write-Host "   ✓ Consolidated: $file" -ForegroundColor Green
        }
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 5: CONSOLIDATE ENGINES
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 5: Consolidating ENGINES..." -ForegroundColor Yellow

$enginesDir = Join-Path $ProjectRoot "ENGINES"
$targetEnginesDir = Join-Path $ProjectRoot "src/core/engines"

if (Test-Path $enginesDir) {
    $coreEngineFiles = @(
        "EmbeddingEngine.ts",
        "NeuralCoreMagnet.ts",
        "SemanticEngine.ts",
        "SelfHealingEngine.ts",
        "VSCodeBridge.ts"
    )
    
    foreach ($file in $coreEngineFiles) {
        $srcPath = Join-Path $enginesDir $file
        if (Test-Path $srcPath) {
            Copy-Item -Path $srcPath -Destination $targetEnginesDir -Force
            Write-Host "   ✓ Consolidated: $file" -ForegroundColor Green
        }
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 6: GENERATE PROJECT STATS
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n📌 PHASE 6: Generating project statistics..." -ForegroundColor Yellow

$tsFiles = (Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.ts" -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*node_modules*" }).Count
$jsFiles = (Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.js" -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*node_modules*" }).Count
$jsonFiles = (Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.json" -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*node_modules*" }).Count
$mdFiles = (Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.md" -File -ErrorAction SilentlyContinue).Count

Write-Host @"

╔═══════════════════════════════════════════════════════════════════════════════╗
║                         📊 PROJECT STATISTICS                                 ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║   TypeScript Files:  $($tsFiles.ToString().PadRight(55))║
║   JavaScript Files:  $($jsFiles.ToString().PadRight(55))║
║   JSON Files:        $($jsonFiles.ToString().PadRight(55))║
║   Markdown Files:    $($mdFiles.ToString().PadRight(55))║
║   Duplicates Removed: $($duplicatesRemoved.ToString().PadRight(54))║
╚═══════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "✅ CONSOLIDATION COMPLETE!" -ForegroundColor Green
Write-Host ""
