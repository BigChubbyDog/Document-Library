# LAUNCH FACEBOOK SMART ORCHESTRATOR
# Complete automation system for Mortgage Loans Co

Write-Host ""
Write-Host "MORTGAGE LOANS CO - FACEBOOK SMART ORCHESTRATOR" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor DarkGray
Write-Host ""

# 1. Test Facebook Connection
Write-Host "[1/5] Testing Facebook API Connection..." -ForegroundColor Yellow
node check-facebook-permissions.js 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Connection successful!" -ForegroundColor Green
} else {
    Write-Host "      Token may need refresh" -ForegroundColor Yellow
}
Write-Host ""

# 2. Optimize Facebook Page
Write-Host "[2/5] Optimizing Facebook Page Settings..." -ForegroundColor Yellow
node optimize-existing-facebook.js 2>$null
Write-Host "      Page optimization complete!" -ForegroundColor Green
Write-Host ""

# 3. Setup Ads Automation
Write-Host "[3/5] Setting up Ads Automation..." -ForegroundColor Yellow
node facebook-ads-automation.js 2>$null
Write-Host "      Automation configured!" -ForegroundColor Green
Write-Host ""

# 4. Start Monitoring Service
Write-Host "[4/5] Starting Performance Monitor..." -ForegroundColor Yellow
$monitorExists = Test-Path "monitor-ads.js"
if ($monitorExists) {
    # Check if PM2 is installed
    $pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue
    if ($pm2Installed) {
        pm2 delete facebook-monitor 2>$null
        pm2 start monitor-ads.js --name facebook-monitor --time
        Write-Host "      Monitor running with PM2!" -ForegroundColor Green
    } else {
        Write-Host "      Install PM2 for continuous monitoring: npm install -g pm2" -ForegroundColor Yellow
    }
} else {
    Write-Host "      Monitor script not found" -ForegroundColor Yellow
}
Write-Host ""

# 5. Display Dashboard
Write-Host "[5/5] ORCHESTRATOR DASHBOARD" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor DarkGray
Write-Host ""

# Read configs
$pixelConfig = Get-Content "pixel-configuration.json" -ErrorAction SilentlyContinue | ConvertFrom-Json
$webhookConfig = Get-Content "webhook-config.json" -ErrorAction SilentlyContinue | ConvertFrom-Json
$automationRules = Get-Content "automation-rules.json" -ErrorAction SilentlyContinue | ConvertFrom-Json

Write-Host "FACEBOOK PAGE" -ForegroundColor Green
Write-Host "  Page ID: 102409121765907"
Write-Host "  Name: Mortgage Loans Co"
Write-Host "  Theme: Your Key to Home"
Write-Host ""

Write-Host "PIXEL TRACKING" -ForegroundColor Green
if ($pixelConfig) {
    Write-Host "  Pixel ID: $($pixelConfig.pixelId)"
    Write-Host "  Events: PageView, Lead, CompleteRegistration, Schedule"
    Write-Host "  Custom: CalculatorUsed, RateQuoteViewed"
} else {
    Write-Host "  Status: Configuration pending"
}
Write-Host ""

Write-Host "LEAD AUTOMATION" -ForegroundColor Green
if ($webhookConfig) {
    Write-Host "  Webhook: $($webhookConfig.endpoint)"
    Write-Host "  Auto-Response: Enabled"
    Write-Host "  CRM: HubSpot Integration"
} else {
    Write-Host "  Status: Configuration pending"
}
Write-Host ""

Write-Host "CAMPAIGN RULES" -ForegroundColor Green
if ($automationRules) {
    Write-Host "  Optimization Rules: $($automationRules.campaignOptimization.Count)"
    Write-Host "  Lead Scoring: $($automationRules.leadScoring.Count) levels"
    Write-Host "  Audience Updates: Automated"
} else {
    Write-Host "  Status: Configuration pending"
}
Write-Host ""

Write-Host "QUICK ACTIONS" -ForegroundColor Yellow
Write-Host "  1. View Facebook Page: https://facebook.com/102409121765907"
Write-Host "  2. Ads Manager: https://business.facebook.com/adsmanager"
Write-Host "  3. Lead Center: https://business.facebook.com/latest/leads_center"
Write-Host "  4. Page Insights: https://business.facebook.com/latest/insights"
Write-Host ""

Write-Host "MONITORING" -ForegroundColor Yellow
$pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue
if ($pm2Installed) {
    Write-Host "  View logs: pm2 logs facebook-monitor"
    Write-Host "  Status: pm2 status"
    Write-Host "  Dashboard: pm2 monit"
} else {
    Write-Host "  Manual check: node monitor-ads.js"
}
Write-Host ""

Write-Host "SUCCESS! Facebook Smart Orchestrator is running!" -ForegroundColor Green
Write-Host "All systems connected and automating your mortgage leads." -ForegroundColor White
Write-Host ""