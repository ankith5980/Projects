# MongoDB Credentials Emergency Response Script
# Run this immediately after GitHub security alert

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "  MONGODB CREDENTIALS SECURITY ALERT" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "GitHub detected MongoDB credentials in your repository." -ForegroundColor Yellow
Write-Host "This script will help you secure your database." -ForegroundColor Yellow
Write-Host ""

# Step 1: Verify current status
Write-Host "STEP 1: Verifying current security status..." -ForegroundColor Cyan
Write-Host ""

$envGitignored = Select-String -Path .gitignore -Pattern "\.env" -Quiet
$envTracked = git ls-files | Select-String "\.env$" | Where-Object { $_ -notmatch "example" }

if ($envGitignored) {
    Write-Host "[OK] .env is in .gitignore" -ForegroundColor Green
} else {
    Write-Host "[ERROR] .env is NOT in .gitignore!" -ForegroundColor Red
}

if (-not $envTracked) {
    Write-Host "[OK] .env files are not tracked by git" -ForegroundColor Green
} else {
    Write-Host "[ERROR] .env files ARE tracked by git!" -ForegroundColor Red
    Write-Host "Tracked files:" -ForegroundColor Yellow
    $envTracked
}

Write-Host ""
Write-Host "Current MongoDB URI in server/.env:" -ForegroundColor Cyan
if (Test-Path "server/.env") {
    $mongoUri = Select-String -Path "server/.env" -Pattern "MONGODB_URI=" | Select-Object -First 1
    if ($mongoUri) {
        Write-Host $mongoUri.Line -ForegroundColor Yellow
        Write-Host ""
        Write-Host "[WARNING] The credentials in this URI are exposed!" -ForegroundColor Red
    }
} else {
    Write-Host "[ERROR] server/.env not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMMEDIATE ACTIONS REQUIRED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. GO TO MONGODB ATLAS NOW:" -ForegroundColor Yellow
Write-Host "   https://cloud.mongodb.com" -ForegroundColor White
Write-Host ""

Write-Host "2. CHANGE PASSWORD:" -ForegroundColor Yellow
Write-Host "   - Database Access > Find user 'rotaryuser'" -ForegroundColor White
Write-Host "   - Edit > Edit Password > Autogenerate" -ForegroundColor White
Write-Host "   - COPY THE NEW PASSWORD!" -ForegroundColor White
Write-Host "   - Update User" -ForegroundColor White
Write-Host ""

Write-Host "3. OR CREATE NEW USER (Recommended):" -ForegroundColor Yellow
Write-Host "   - Database Access > Add New Database User" -ForegroundColor White
Write-Host "   - Username: rotary_prod_user" -ForegroundColor White
Write-Host "   - Autogenerate Secure Password" -ForegroundColor White
Write-Host "   - COPY THE PASSWORD!" -ForegroundColor White
Write-Host "   - Add User" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you changed the MongoDB password? (y/n)"

if ($continue -eq "y") {
    Write-Host ""
    Write-Host "4. UPDATE LOCAL .env FILE:" -ForegroundColor Yellow
    Write-Host "   Opening server/.env for you to edit..." -ForegroundColor White
    
    if (Test-Path "server/.env") {
        # Try to open in default editor
        Start-Process "server/.env"
        Write-Host ""
        Write-Host "   Update MONGODB_URI with your new credentials:" -ForegroundColor White
        Write-Host "   MONGODB_URI=mongodb+srv://NEW_USER:NEW_PASSWORD@cluster0.jtwlq6k.mongodb.net/rotary-club?retryWrites=true&w=majority&appName=Cluster0" -ForegroundColor Gray
    }
    
    Write-Host ""
    $updated = Read-Host "Have you updated server/.env with new credentials? (y/n)"
    
    if ($updated -eq "y") {
        Write-Host ""
        Write-Host "5. GENERATING NEW JWT SECRETS:" -ForegroundColor Yellow
        Write-Host ""
        
        # Check if Node.js is available
        if (Get-Command node -ErrorAction SilentlyContinue) {
            Write-Host "   Add these to your server/.env:" -ForegroundColor White
            Write-Host ""
            Write-Host "   JWT_ACCESS_SECRET=" -NoNewline -ForegroundColor Gray
            $accessSecret = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
            Write-Host $accessSecret -ForegroundColor Green
            Write-Host ""
            Write-Host "   JWT_REFRESH_SECRET=" -NoNewline -ForegroundColor Gray
            $refreshSecret = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
            Write-Host $refreshSecret -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "   [ERROR] Node.js not found. Generate secrets manually:" -ForegroundColor Red
            Write-Host "   Use: https://www.random.org/strings/" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "6. DISMISS GITHUB ALERT:" -ForegroundColor Yellow
        Write-Host "   - Go to: https://github.com/ankith5980/Projects/security" -ForegroundColor White
        Write-Host "   - Click on MongoDB alert" -ForegroundColor White
        Write-Host "   - Select 'Revoked' (credentials changed)" -ForegroundColor White
        Write-Host "   - Close alert" -ForegroundColor White
        Write-Host ""
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  NEXT STEPS" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "1. Test locally:" -ForegroundColor Cyan
        Write-Host "   cd server && npm start" -ForegroundColor White
        Write-Host ""
        Write-Host "2. Verify old credentials no longer work" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. When deploying to Render:" -ForegroundColor Cyan
        Write-Host "   - Use the NEW MongoDB URI" -ForegroundColor White
        Write-Host "   - Use the NEW JWT secrets" -ForegroundColor White
        Write-Host ""
        Write-Host "4. Read EMERGENCY_CREDENTIALS_EXPOSED.md for more details" -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT REMINDERS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[CRITICAL] Never commit .env files to git" -ForegroundColor Red
Write-Host "[CRITICAL] Always use .env.example for templates" -ForegroundColor Red
Write-Host "[CRITICAL] Use Render's env vars UI for production" -ForegroundColor Red
Write-Host "[CRITICAL] Rotate secrets every 90 days" -ForegroundColor Red
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "  - EMERGENCY_CREDENTIALS_EXPOSED.md" -ForegroundColor White
Write-Host "  - SECURITY_CHECKLIST.md" -ForegroundColor White
Write-Host ""
