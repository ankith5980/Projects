# Build script for Render deployment

Write-Host "🚀 Building Rotary Club Portal for Render..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "server") -or -not (Test-Path "client")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server dependency installation failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "`n📦 Installing client dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client dependency installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🏗️  Building client..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client build failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "2. Update MongoDB credentials" -ForegroundColor White
Write-Host "3. Push to GitHub" -ForegroundColor White
Write-Host "4. Deploy on Render" -ForegroundColor White
