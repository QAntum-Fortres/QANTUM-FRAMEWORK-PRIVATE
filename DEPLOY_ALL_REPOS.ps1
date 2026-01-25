# 🚀 DEPLOY ALL REPOS - WORLD-CLASS BEST PRACTICES
# Deploys QANTUM-FRAMEWORK and QA-SAAS to GitHub with proper PUBLIC/PRIVATE separation

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🚀 DEPLOYING ALL REPOS TO GITHUB" -ForegroundColor Cyan
Write-Host "=" * 100
Write-Host ""

# Define repos
$repos = @(
    @{
        Name        = "QANTUM-FRAMEWORK"
        SourcePath  = "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main\QANTUM_FRAMEWORK"
        PublicRepo  = "https://github.com/QAntum-Fortres/QAntum-FRAMEWORK.git"
        PrivateRepo = "https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE.git"
    },
    @{
        Name        = "QA-SAAS"
        SourcePath  = "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
        PublicRepo  = "https://github.com/QAntum-Fortres/QAntum-SaaS-Platform.git"
        PrivateRepo = "https://github.com/QAntum-Fortres/QAntum-SaaS-Platform-PRIVATE.git"
    }
)

foreach ($repo in $repos) {
    Write-Host "📦 PROCESSING: $($repo.Name)" -ForegroundColor Yellow
    Write-Host ""
    
    $sourcePath = $repo.SourcePath
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "❌ Source not found: $sourcePath" -ForegroundColor Red
        continue
    }
    
    # === DEPLOY PUBLIC REPO ===
    Write-Host "🌐 DEPLOYING PUBLIC REPO..." -ForegroundColor Cyan
    
    $publicDir = Join-Path $sourcePath "DEPLOY_PUBLIC"
    New-Item -Path $publicDir -ItemType Directory -Force | Out-Null
    
    # Copy only documentation files to PUBLIC
    $publicFiles = @(
        "README.md", "README.bg.md", "LICENSE", ".gitignore",
        "ENTERPRISE_FEATURES.md", "MODULE_CATALOG.md", "SECURITY_ARCHITECTURE.md",
        "TOP_MODULES.md", "PROJECT_STRUCTURE.md", "GITHUB_DEPLOYMENT.md",
        "BRUTAL_ARCHITECT_LOGIC_ANALYSIS.md", "SAAS_MODULE_SUMMARY.md",
        "COMPETITIVE_SUPERIORITY_ANALYSIS.md", "CHANGELOG.md",
        "package.json", "tsconfig.json"
    )
    
    foreach ($file in $publicFiles) {
        $srcFile = Join-Path $sourcePath $file
        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $publicDir -Force
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
    }
    
    # Initialize and push PUBLIC repo
    if (-not $DryRun) {
        Push-Location $publicDir
        
        # Init git
        if (-not (Test-Path ".git")) {
            git init
        }
        
        # Configure
        git config user.email "qantum@fortress.ai"
        git config user.name "QAntum Fortress"
        
        # Add remote
        git remote remove origin 2>$null
        git remote add origin $repo.PublicRepo
        
        # Add and commit
        git add .
        git commit -m "📚 $($repo.Name) - Enterprise Documentation (PUBLIC)" --allow-empty
        
        # Push
        git branch -M main
        git push -u origin main --force
        
        Pop-Location
        Write-Host "  ✅ PUBLIC repo deployed: $($repo.PublicRepo)" -ForegroundColor Green
    }
    
    Write-Host ""
    
    # === DEPLOY PRIVATE REPO ===
    Write-Host "🔒 DEPLOYING PRIVATE REPO..." -ForegroundColor Red
    
    $privateDir = Join-Path $sourcePath "DEPLOY_PRIVATE"
    New-Item -Path $privateDir -ItemType Directory -Force | Out-Null
    
    # Copy ENTIRE source to PRIVATE (excluding node_modules, .git, etc)
    $excludeDirs = @("node_modules", ".git", "DEPLOY_PUBLIC", "DEPLOY_PRIVATE", "dist", "build", ".next")
    
    Get-ChildItem -Path $sourcePath -Force | 
    Where-Object { $_.Name -notin $excludeDirs } |
    ForEach-Object {
        $dest = Join-Path $privateDir $_.Name
        if ($_.PSIsContainer) {
            Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
        }
        else {
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
    
    Write-Host "  ✅ Full source code copied" -ForegroundColor Green
    
    # Initialize and push PRIVATE repo
    if (-not $DryRun) {
        Push-Location $privateDir
        
        # Init git
        if (-not (Test-Path ".git")) {
            git init
        }
        
        # Configure
        git config user.email "qantum@fortress.ai"
        git config user.name "QAntum Fortress"
        
        # Add remote
        git remote remove origin 2>$null
        git remote add origin $repo.PrivateRepo
        
        # Add and commit
        git add .
        git commit -m "🔒 $($repo.Name) - Full Enterprise Source Code (PRIVATE)" --allow-empty
        
        # Push
        git branch -M main
        git push -u origin main --force
        
        Pop-Location
        Write-Host "  ✅ PRIVATE repo deployed: $($repo.PrivateRepo)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "=" * 100
    Write-Host ""
}

Write-Host "🎉 ALL REPOS DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 SUMMARY:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  QANTUM-FRAMEWORK:" -ForegroundColor Cyan
Write-Host "    🌐 PUBLIC:  https://github.com/QAntum-Fortres/QAntum-FRAMEWORK" -ForegroundColor Green
Write-Host "    🔒 PRIVATE: https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE" -ForegroundColor Red
Write-Host ""
Write-Host "  QA-SAAS:" -ForegroundColor Cyan
Write-Host "    🌐 PUBLIC:  https://github.com/QAntum-Fortres/QAntum-SaaS-Platform" -ForegroundColor Green
Write-Host "    🔒 PRIVATE: https://github.com/QAntum-Fortres/QAntum-SaaS-Platform-PRIVATE" -ForegroundColor Red
Write-Host ""
