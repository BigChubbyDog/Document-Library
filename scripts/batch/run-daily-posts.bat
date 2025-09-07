@echo off
REM Daily Facebook Automation for Mortgage Loans Co
REM Runs at 9:00 AM daily via Windows Task Scheduler

echo ========================================
echo Daily Facebook Posts - %date% %time%
echo ========================================

cd /d "C:\Users\dusta\repos\mortgage-campaign-intelligence"

REM Run the daily automation
node daily-facebook-automation.js

echo.
echo Daily posting complete!
echo Next run: Tomorrow at 9:00 AM
echo.

REM Keep window open for 5 seconds to see results
timeout /t 5 /nobreak > nul