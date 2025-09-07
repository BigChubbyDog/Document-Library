# 🚀 MORTGAGE LOANS CO - FACEBOOK OPTIMIZATION LAUNCHER
# Complete setup and optimization script
# Run this to implement everything!

Write-Host ""
Write-Host "🏠 MORTGAGE LOANS CO - FACEBOOK OPTIMIZATION LAUNCHER" -ForegroundColor Cyan
Write-Host "🔑 'Your Key to Home' Campaign Activation" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Check for required environment variables
$requiredVars = @(
    "FACEBOOK_ACCESS_TOKEN",
    "FB_PIXEL_ID"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not (Get-Item -Path "Env:$var" -ErrorAction SilentlyContinue)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "⚠️ Missing required environment variables:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please set these variables before running the optimization." -ForegroundColor Yellow
    Write-Host ""
    
    # Offer to set them now
    $setupNow = Read-Host "Would you like to set them now? (Y/N)"
    if ($setupNow -eq "Y" -or $setupNow -eq "y") {
        $token = Read-Host "Enter Facebook Access Token" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
        $tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        [Environment]::SetEnvironmentVariable("FACEBOOK_ACCESS_TOKEN", $tokenPlain, "User")
        
        $pixelId = Read-Host "Enter Facebook Pixel ID"
        [Environment]::SetEnvironmentVariable("FB_PIXEL_ID", $pixelId, "User")
        
        Write-Host "✅ Environment variables set!" -ForegroundColor Green
    } else {
        exit 1
    }
}

# Menu for selective optimization
Write-Host "🎯 OPTIMIZATION MENU" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray
Write-Host "1. 🚀 FULL OPTIMIZATION (Everything)" -ForegroundColor Green
Write-Host "2. 📄 Page Settings Only" -ForegroundColor White
Write-Host "3. 📝 Lead Forms Only" -ForegroundColor White
Write-Host "4. 👥 Audiences Only" -ForegroundColor White
Write-Host "5. Automation and Bot Only" -ForegroundColor White
Write-Host "6. 📊 Analytics Only" -ForegroundColor White
Write-Host "7. 🎨 Create Ad Templates" -ForegroundColor White
Write-Host "8. 🧪 Run Tests" -ForegroundColor White
Write-Host "9. 📈 View Current Status" -ForegroundColor White
Write-Host "0. ❌ Exit" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Select option (1-9, 0 to exit)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 RUNNING FULL OPTIMIZATION..." -ForegroundColor Green
        Write-Host ""
        
        # Run the complete optimization
        node implement-facebook-optimization.js
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ OPTIMIZATION COMPLETE!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📊 What's been configured:" -ForegroundColor Cyan
            Write-Host "  ✓ Business Manager settings" -ForegroundColor Gray
            Write-Host "  ✓ Page optimization with 'Your Key to Home' branding" -ForegroundColor Gray
            Write-Host "  ✓ Advanced lead forms with psychological triggers" -ForegroundColor Gray
            Write-Host "  ✓ 5 audience segments (Dreamer, Upgrader, Optimizer, Veteran, VIP)" -ForegroundColor Gray
            Write-Host "  ✓ Facebook Pixel with 7 custom events" -ForegroundColor Gray
            Write-Host "  ✓ 4 automation rules for optimization" -ForegroundColor Gray
            Write-Host "  ✓ Morgan messenger bot configured" -ForegroundColor Gray
            Write-Host "  ✓ 5 initial campaigns created (PAUSED)" -ForegroundColor Gray
            Write-Host "  ✓ A/B testing framework" -ForegroundColor Gray
            Write-Host "  ✓ Analytics dashboards" -ForegroundColor Gray
            Write-Host ""
            Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
            Write-Host "  1. Review campaigns in Facebook Ads Manager" -ForegroundColor White
            Write-Host "  2. Upload creative assets (images/videos)" -ForegroundColor White
            Write-Host "  3. Activate campaigns one by one" -ForegroundColor White
            Write-Host "  4. Monitor performance daily" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host "❌ Optimization encountered errors. Check logs above." -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host "📄 Optimizing Page Settings..." -ForegroundColor Cyan
        node -e "const opt = require('./implement-facebook-optimization.js'); const o = new opt(); o.optimizePageSettings().then(() => console.log('✅ Done!'))"
    }
    
    "3" {
        Write-Host "📝 Creating Lead Forms..." -ForegroundColor Cyan
        node -e "const opt = require('./implement-facebook-optimization.js'); const o = new opt(); o.createLeadForms().then(() => console.log('✅ Done!'))"
    }
    
    "4" {
        Write-Host "👥 Building Audiences..." -ForegroundColor Cyan
        node -e "const opt = require('./implement-facebook-optimization.js'); const o = new opt(); o.buildAudiences().then(() => console.log('✅ Done!'))"
    }
    
    "5" {
        Write-Host "🤖 Setting up Automation..." -ForegroundColor Cyan
        node -e "const opt = require('./implement-facebook-optimization.js'); const o = new opt(); o.configureAutomation().then(() => o.setupMessengerBot()).then(() => console.log('✅ Done!'))"
    }
    
    "6" {
        Write-Host "📊 Configuring Analytics..." -ForegroundColor Cyan
        node -e "const opt = require('./implement-facebook-optimization.js'); const o = new opt(); o.configureAnalytics().then(() => console.log('✅ Done!'))"
    }
    
    "7" {
        Write-Host "🎨 Creating Ad Templates..." -ForegroundColor Cyan
        Write-Host ""
        
        # Create ad templates directory
        New-Item -ItemType Directory -Force -Path ".\ad-templates" | Out-Null
        
        # Generate ad copy templates
        @"
{
  "campaigns": {
    "first_time_buyers": {
      "headlines": [
        "🏠 Your Dream Home is Waiting",
        "🔑 Unlock Your First Home Today",
        "💰 $0 Down Options Available",
        "📊 Get Pre-Approved in 60 Seconds",
        "🎯 First-Time Buyer? Start Here"
      ],
      "primary_text": [
        "Stop paying rent! With FHA loans starting at 3.5% down, your dream home is closer than you think. Join 4,387 Texas families who got their keys this year.",
        "Tired of landlords? It's time to build equity! Our 15-day close guarantee means you'll be in your home fast. Get your custom rate in 60 seconds.",
        "Renting is throwing money away. For less than your rent, you could own! Free credit repair included. Let's unlock your future together."
      ],
      "descriptions": [
        "NMLS #2044646 | 15-Day Close Guarantee",
        "Free Credit Repair | Rate Match Plus",
        "4.9★ Rating | 500+ Happy Homeowners"
      ]
    },
    "refinance": {
      "headlines": [
        "💰 Save $500/Month on Your Mortgage",
        "📉 Rates Dropped - Refinance Now",
        "🔄 Cash Out Your Home Equity",
        "⏰ Lock Your Rate Before It's Too Late",
        "💸 Stop Overpaying Your Mortgage"
      ],
      "primary_text": [
        "Rates have dropped! The average homeowner saves $487/month by refinancing. See your savings in 60 seconds - no credit impact.",
        "Your home's value went up. Your rate should go down. Free refinance analysis shows exactly how much you'll save. 15-day close guaranteed.",
        "Still paying 7%+? Today's rates are in the low 6s! Calculate your savings instantly. We'll beat any competitor's rate by 0.125%."
      ]
    },
    "va_loans": {
      "headlines": [
        "🎖️ $0 Down VA Loans for Heroes",
        "🇺🇸 Veterans: Your Service Paid for This",
        "🏠 Thank You for Your Service - $0 Down",
        "💪 Military Families: No Down Payment",
        "⭐ VA Loans: You've Earned This Benefit"
      ],
      "primary_text": [
        "You served our country. Now let us serve you. $0 down, no PMI, and the lowest rates available. Your path home starts here.",
        "Your military service earned you incredible benefits. VA loans mean $0 down payment and no PMI. Let's get you home.",
        "From deployment to dream home. VA loans exclusive for military families. Zero down, streamlined approval. You've earned this."
      ]
    }
  },
  "creatives": {
    "image_specs": {
      "feed": {
        "width": 1200,
        "height": 628,
        "format": "jpg"
      },
      "stories": {
        "width": 1080,
        "height": 1920,
        "format": "jpg"
      },
      "carousel": {
        "width": 1080,
        "height": 1080,
        "format": "jpg"
      }
    },
    "video_specs": {
      "aspect_ratio": "16:9",
      "length": "15-30 seconds",
      "captions": "required"
    }
  },
  "cta_buttons": [
    "Learn More",
    "Apply Now",
    "Get Quote",
    "Sign Up",
    "Contact Us"
  ]
}
"@ | Out-File -FilePath ".\ad-templates\ad-copy-templates.json" -Encoding UTF8
        
        Write-Host "✅ Ad templates created in .\ad-templates\" -ForegroundColor Green
        Write-Host ""
    }
    
    "8" {
        Write-Host "🧪 Running Tests..." -ForegroundColor Cyan
        Write-Host ""
        
        # Test API connection
        Write-Host "Testing Facebook API connection..." -ForegroundColor White
        $testResult = node -e "
        const axios = require('axios');
        axios.get('https://graph.facebook.com/v18.0/me', {
            params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN }
        }).then(r => {
            console.log('✅ API Connection: SUCCESS');
            console.log('   Account:', r.data.name);
        }).catch(e => {
            console.log('❌ API Connection: FAILED');
            console.log('   Error:', e.message);
        });
        "
        
        Write-Host ""
    }
    
    "9" {
        Write-Host "📈 Checking Current Status..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check current configuration status
        node -e "
        const axios = require('axios');
        const token = process.env.FACEBOOK_ACCESS_TOKEN;
        const pageId = '102409121765907';
        
        async function checkStatus() {
            try {
                // Check page
                const page = await axios.get(\`https://graph.facebook.com/v18.0/\${pageId}\`, {
                    params: { 
                        access_token: token,
                        fields: 'name,about,phone,website,emails'
                    }
                });
                
                console.log('📄 PAGE STATUS:');
                console.log('   Name:', page.data.name || 'Not set');
                console.log('   Phone:', page.data.phone || 'Not set');
                console.log('   Website:', page.data.website || 'Not set');
                console.log('');
                
                // Check lead forms
                const forms = await axios.get(\`https://graph.facebook.com/v18.0/\${pageId}/leadgen_forms\`, {
                    params: { access_token: token }
                });
                
                console.log('📝 LEAD FORMS:', forms.data.data ? forms.data.data.length : 0, 'forms');
                
                // Check audiences
                const audiences = await axios.get('https://graph.facebook.com/v18.0/act_1170970241206263/customaudiences', {
                    params: { access_token: token }
                }).catch(() => ({ data: { data: [] } }));
                
                console.log('👥 AUDIENCES:', audiences.data.data ? audiences.data.data.length : 0, 'audiences');
                
            } catch (error) {
                console.log('❌ Error checking status:', error.message);
            }
        }
        
        checkStatus();
        "
        
        Write-Host ""
    }
    
    "0" {
        Write-Host "👋 Exiting..." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")