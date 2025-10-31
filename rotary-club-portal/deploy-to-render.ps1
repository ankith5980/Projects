# Quick Deploy to Render
# PowerShell script to help prepare for deployment

Write-Host "Rotary Club Portal - Render Deployment Helper" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Not a git repository. Please run 'git init' first." -ForegroundColor Red
    exit 1
}

Write-Host "Pre-Deployment Checklist" -ForegroundColor Yellow
Write-Host ""

# Check for sensitive data
Write-Host "1. Checking for sensitive data..." -ForegroundColor Cyan
$envFiles = Get-ChildItem -Path . -Recurse -Filter "*.env" -Exclude "*.example" | Where-Object { $_.FullName -notmatch "node_modules" }
if ($envFiles.Count -gt 0) {
    Write-Host "   Warning: .env files found. Make sure they're in .gitignore" -ForegroundColor Yellow
} else {
    Write-Host "   No .env files found in repository" -ForegroundColor Green
}

# Check .gitignore
Write-Host ""
Write-Host "2. Checking .gitignore..." -ForegroundColor Cyan
if (Test-Path ".gitignore") {
    Write-Host "   .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "   .gitignore not found" -ForegroundColor Red
}

# Check git status
Write-Host ""
Write-Host "3. Checking git status..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   You have uncommitted changes" -ForegroundColor Yellow
    $commit = Read-Host "   Do you want to commit all changes? (y/n)"
    if ($commit -eq "y") {
        git add .
        $message = Read-Host "   Enter commit message"
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "Prepare for Render deployment"
        }
        git commit -m $message
        Write-Host "   Changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "   All changes committed" -ForegroundColor Green
}

# Check remote
Write-Host ""
Write-Host "4. Checking GitHub remote..." -ForegroundColor Cyan
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Remote configured: $remote" -ForegroundColor Green
    $push = Read-Host "   Push to GitHub? (y/n)"
    if ($push -eq "y") {
        Write-Host "   Pushing to GitHub..." -ForegroundColor Cyan
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   Pushed successfully" -ForegroundColor Green
        }
    }
} else {
    Write-Host "   No remote configured" -ForegroundColor Yellow
}

# Generate JWT secrets
Write-Host ""
Write-Host "5. Generating JWT secrets..." -ForegroundColor Cyan
Write-Host "   Copy these for Render environment variables:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   JWT_ACCESS_SECRET=" -NoNewline -ForegroundColor Gray
$accessSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host $accessSecret -ForegroundColor Green
Write-Host ""
Write-Host "   JWT_REFRESH_SECRET=" -NoNewline -ForegroundColor Gray
$refreshSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host $refreshSecret -ForegroundColor Green

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Update MongoDB credentials in Atlas" -ForegroundColor White
Write-Host "2. Go to Render Dashboard" -ForegroundColor White
Write-Host "3. Create Backend Web Service" -ForegroundColor White
Write-Host "4. Create Frontend Static Site" -ForegroundColor White
Write-Host "5. Update CLIENT_URL in backend" -ForegroundColor White
Write-Host ""
Write-Host "Read RENDER_DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
