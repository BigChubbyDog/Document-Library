# Setup Daily Facebook Automation for Mortgage Loans Co
# Creates Windows Task Scheduler job to post daily content

Write-Host "🚀 Setting up Daily Facebook Automation" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor DarkGray
Write-Host ""

# Test the automation first
Write-Host "📝 Testing automation system..." -ForegroundColor Yellow
$testResult = & node daily-facebook-automation.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Automation test successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Automation test failed!" -ForegroundColor Red
    Write-Host $testResult
    exit 1
}

Write-Host ""

# Create the scheduled task
Write-Host "⏰ Creating daily schedule..." -ForegroundColor Yellow

# Delete existing task if it exists
schtasks /delete /tn "Mortgage Facebook Daily Posts" /f 2>$null

# Create new task - runs every day at 9:00 AM
$taskResult = schtasks /create /tn "Mortgage Facebook Daily Posts" /tr "C:\Users\dusta\repos\mortgage-campaign-intelligence\run-daily-posts.bat" /sc daily /st 09:00 /f

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Daily task created successfully!" -ForegroundColor Green
    Write-Host "   Task: 'Mortgage Facebook Daily Posts'" 
    Write-Host "   Schedule: Every day at 9:00 AM"
    Write-Host "   Script: run-daily-posts.bat"
} else {
    Write-Host "❌ Failed to create scheduled task!" -ForegroundColor Red
    Write-Host $taskResult
}

Write-Host ""

# Show task information
Write-Host "📋 Task Details:" -ForegroundColor Cyan
schtasks /query /tn "Mortgage Facebook Daily Posts" /fo LIST 2>$null

Write-Host ""
Write-Host "🎯 What happens now:" -ForegroundColor Yellow
Write-Host "   • Facebook posts will auto-publish daily at 9:00 AM"
Write-Host "   • Monday: Calculator Monday content"
Write-Host "   • Tuesday: Education content" 
Write-Host "   • Wednesday: Comparison tools"
Write-Host "   • Thursday: Success stories"
Write-Host "   • Friday: First-time buyer focus"
Write-Host "   • Saturday: Current rates"
Write-Host "   • Sunday: Week planning"
Write-Host ""

Write-Host "🔧 Manual Controls:" -ForegroundColor Yellow
Write-Host "   • Run now: .\run-daily-posts.bat"
Write-Host "   • View logs: type daily-automation-log.json"
Write-Host "   • Disable: schtasks /change /tn 'Mortgage Facebook Daily Posts' /disable"
Write-Host "   • Enable: schtasks /change /tn 'Mortgage Facebook Daily Posts' /enable"
Write-Host ""

Write-Host "✅ Daily Facebook automation is now active!" -ForegroundColor Green
Write-Host "Your posts will automatically happen every day at 9:00 AM." -ForegroundColor White