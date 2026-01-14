# 🔥 ULTIMATE REPO ORGANIZER
# Organizes FRAMEWORK and QA-SAAS into PUBLIC/PRIVATE structure
# World-class best practices for enterprise GitHub deployment

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🔥 ULTIMATE REPO ORGANIZER - PUBLIC/PRIVATE STRUCTURE" -ForegroundColor Cyan
Write-Host "=" * 100
Write-Host ""

# Define projects
$projects = @(
    @{
        Name        = "QANTUM_FRAMEWORK"
        SourcePath  = "c:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main\QANTUM_FRAMEWORK"
        PublicRepo  = "QAntum-Fortres/FRAMEWORK"
        PrivateRepo = "QAntum-Fortres/FRAMEWORK-PRIVATE"
    },
    @{
        Name        = "QA-SAAS"
        SourcePath  = "c:\Users\papic\source\repos\papica777-eng\QA-SAAS"
        PublicRepo  = "QAntum-Fortres/QA-SAAS"
        PrivateRepo = "QAntum-Fortres/QA-SAAS-PRIVATE"
    }
)

foreach ($project in $projects) {
    Write-Host "📦 ORGANIZING: $($project.Name)" -ForegroundColor Yellow
    Write-Host ""
    
    if (-not (Test-Path $project.SourcePath)) {
        Write-Host "⚠️  Source not found: $($project.SourcePath)" -ForegroundColor Red
        Write-Host ""
        continue
    }
    
    # Create PUBLIC and PRIVATE directories
    $publicDir = Join-Path $project.SourcePath "DEPLOY_PUBLIC"
    $privateDir = Join-Path $project.SourcePath "DEPLOY_PRIVATE"
    
    if (-not $DryRun) {
        New-Item -Path $publicDir -ItemType Directory -Force | Out-Null
        New-Item -Path $privateDir -ItemType Directory -Force | Out-Null
    }
    
    Write-Host "  📁 Public:  $publicDir" -ForegroundColor Green
    Write-Host "  🔒 Private: $privateDir" -ForegroundColor Red
    Write-Host ""
    
    # PUBLIC FILES (Documentation + Showcase only)
    $publicFiles = @(
        "README.md",
        "README.bg.md",
        "LICENSE",
        "ENTERPRISE_FEATURES.md",
        "MODULE_CATALOG.md",
        "SECURITY_ARCHITECTURE.md",
        "TOP_MODULES.md",
        "BRUTAL_ARCHITECT_LOGIC_ANALYSIS.md",
        "PROJECT_STRUCTURE.md",
        "GITHUB_DEPLOYMENT.md",
        "INTEGRATION_REPORT.md",
        "AUTO_INTEGRATION_REPORT.md",
        "SAAS_MODULE_SUMMARY.md",
        ".gitignore",
        "package.json",
        "tsconfig.json"
    )
    
    Write-Host "  📋 PUBLIC FILES (Documentation):" -ForegroundColor Cyan
    $publicCount = 0
    foreach ($file in $publicFiles) {
        $sourcePath = Join-Path $project.SourcePath $file
        if (Test-Path $sourcePath) {
            $targetPath = Join-Path $publicDir $file
            if (-not $DryRun) {
                Copy-Item -Path $sourcePath -Destination $targetPath -Force
            }
            Write-Host "    ✅ $file" -ForegroundColor Green
            $publicCount++
        }
    }
    Write-Host "    Total: $publicCount files" -ForegroundColor DarkGray
    Write-Host ""
    
    # PRIVATE FILES (Full codebase)
    Write-Host "  🔒 PRIVATE FILES (Full Source):" -ForegroundColor Red
    
    if (-not $DryRun) {
        # Copy entire project
        $excludeDirs = @("node_modules", ".git", "dist", "build", ".next", "DEPLOY_PUBLIC", "DEPLOY_PRIVATE")
        
        Get-ChildItem -Path $project.SourcePath -Recurse -Force |
        Where-Object { 
            $exclude = $false
            foreach ($dir in $excludeDirs) {
                if ($_.FullName -match [regex]::Escape($dir)) {
                    $exclude = $true
                    break
                }
            }
            -not $exclude
        } |
        ForEach-Object {
            $targetPath = $_.FullName.Replace($project.SourcePath, $privateDir)
            if ($_.PSIsContainer) {
                New-Item -Path $targetPath -ItemType Directory -Force | Out-Null
            }
            else {
                $targetFolder = Split-Path $targetPath
                New-Item -Path $targetFolder -ItemType Directory -Force | Out-Null
                Copy-Item -Path $_.FullName -Destination $targetPath -Force
            }
        }
    }
    
    Write-Host "    ✅ Full source code copied" -ForegroundColor Green
    Write-Host "    ✅ All modules included" -ForegroundColor Green
    Write-Host "    ✅ All configurations included" -ForegroundColor Green
    Write-Host ""
    
    # Create deployment instructions
    $deployInstructions = @"
# 🚀 DEPLOYMENT INSTRUCTIONS - $($project.Name)

## 📦 Repository Structure

### 🌐 PUBLIC Repository: $($project.PublicRepo)
**Purpose:** Marketing, documentation, and community showcase  
**Contains:** Documentation files only, NO source code

**Files to deploy:**
- README.md (overview, features, contact)
- LICENSE (proprietary)
- All documentation (.md files)
- package.json (for npm showcase)
- .gitignore

### 🔒 PRIVATE Repository: $($project.PrivateRepo)
**Purpose:** Full enterprise source code (CONFIDENTIAL)  
**Contains:** Complete codebase, all modules, configurations

**Files to deploy:**
- ALL source code (src/, VORTEX_ARSENAL/, etc.)
- All TypeScript/JavaScript files
- Configuration files
- CI/CD workflows
- Dependencies and build tools

---

## 🔥 Deployment Commands

### Step 1: Deploy PUBLIC Repository

``````bash
cd "$publicDir"

# Initialize Git (if not already)
git init
git remote add origin https://github.com/$($project.PublicRepo).git

# Stage documentation files
git add .

# Commit
git commit -m "📚 Enterprise documentation and feature showcase"

# Push to PUBLIC repo
git branch -M main
git push -u origin main --force
``````

### Step 2: Deploy PRIVATE Repository

``````bash
cd "$privateDir"

# Initialize Git (if not already)
git init
git remote add origin https://github.com/$($project.PrivateRepo).git

# Stage ALL files
git add .

# Commit
git commit -m "🔒 Full enterprise source code - CONFIDENTIAL"

# Push to PRIVATE repo
git branch -M main
git push -u origin main --force
``````

---

## ⚠️ CRITICAL SECURITY RULES

### ✅ PUBLIC Repository:
- ✅ Documentation only
- ✅ No source code
- ✅ No API keys
- ✅ No secrets
- ✅ Marketing materials

### 🔒 PRIVATE Repository:
- 🔒 Full source code
- 🔒 All proprietary logic
- 🔒 Enterprise modules
- 🔒 Configuration files
- 🔒 CI/CD workflows

### ❌ NEVER in PUBLIC:
- ❌ Source code (src/, modules/)
- ❌ API keys or secrets
- ❌ Database credentials
- ❌ Proprietary algorithms
- ❌ Internal documentation

---

## 📊 Repository Settings

### PUBLIC Repository Settings:
1. **Visibility:** Public
2. **Topics:** quantum-qa, automation, enterprise, ai-powered, playwright
3. **Description:** "Enterprise-grade QA automation platform with AI-powered testing"
4. **Website:** (your company site)
5. **License:** Proprietary (All Rights Reserved)

### PRIVATE Repository Settings:
1. **Visibility:** Private
2. **Branch Protection:** main branch (require PR reviews)
3. **Secrets:** All API keys, credentials
4. **Collaborators:** Only trusted team members
5. **CI/CD:** GitHub Actions for automated testing

---

## 🎯 Next Steps After Deployment

1. ✅ Verify PUBLIC repo has no source code
2. ✅ Verify PRIVATE repo has full codebase
3. ✅ Configure branch protection on PRIVATE repo
4. ✅ Add GitHub secrets to PRIVATE repo
5. ✅ Test CI/CD workflows on PRIVATE repo
6. ✅ Share PUBLIC repo link for marketing
7. ✅ Keep PRIVATE repo access restricted

---

## 📱 Social Media Announcement (After Deployment)

Use the templates in GITHUB_DEPLOYMENT.md for LinkedIn and Twitter announcements.

---

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Project:** $($project.Name)
"@

    $deployFile = Join-Path $project.SourcePath "DEPLOYMENT_INSTRUCTIONS.md"
    if (-not $DryRun) {
        $deployInstructions | Out-File $deployFile -Encoding UTF8
    }
    
    Write-Host "  📝 Created: DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "=" * 100
    Write-Host ""
}

Write-Host "✅ ORGANIZATION COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Directories Created:" -ForegroundColor Yellow
Write-Host ""

foreach ($project in $projects) {
    Write-Host "  $($project.Name):" -ForegroundColor Cyan
    Write-Host "    📂 $($project.SourcePath)\DEPLOY_PUBLIC    → Push to $($project.PublicRepo)" -ForegroundColor Green
    Write-Host "    🔒 $($project.SourcePath)\DEPLOY_PRIVATE   → Push to $($project.PrivateRepo)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Review DEPLOYMENT_INSTRUCTIONS.md in each project" -ForegroundColor White
Write-Host "  2. Verify PUBLIC folders contain NO source code" -ForegroundColor White
Write-Host "  3. Verify PRIVATE folders contain ALL source code" -ForegroundColor White
Write-Host "  4. Push PUBLIC folders to public GitHub repos" -ForegroundColor White
Write-Host "  5. Push PRIVATE folders to private GitHub repos" -ForegroundColor White
Write-Host ""
Write-Host "🔥 Ready for WORLD-CLASS GitHub deployment!" -ForegroundColor Red
Write-Host ""
