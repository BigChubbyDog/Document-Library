# Setup Daily Facebook Automation for Mortgage Loans Co
# Creates Windows Task Scheduler job to post daily content

Write-Host "Setting up Daily Facebook Automation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor DarkGray

# Test the automation first
Write-Host "Testing automation system..." -ForegroundColor Yellow
node daily-facebook-automation.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "Automation test successful!" -ForegroundColor Green
} else {
    Write-Host "Automation test failed!" -ForegroundColor Red
    exit 1
}

# Create the scheduled task
Write-Host "Creating daily schedule..." -ForegroundColor Yellow

# Delete existing task if it exists
schtasks /delete /tn "Facebook Daily Posts" /f 2>$null

# Create new task - runs every day at 9:00 AM
schtasks /create /tn "Facebook Daily Posts" /tr "C:\Users\dusta\repos\mortgage-campaign-intelligence\run-daily-posts.bat" /sc daily /st 09:00 /f

if ($LASTEXITCODE -eq 0) {
    Write-Host "Daily task created successfully!" -ForegroundColor Green
    Write-Host "Task: Facebook Daily Posts" 
    Write-Host "Schedule: Every day at 9:00 AM"
} else {
    Write-Host "Failed to create scheduled task!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Daily Facebook automation is now active!" -ForegroundColor Green
Write-Host "Posts will happen automatically every day at 9:00 AM" -ForegroundColor White