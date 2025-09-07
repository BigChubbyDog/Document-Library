# 🚀 Quick Start: Deploy Your Content System

## Your Current Situation
You have Ollama running locally with all the scripts ready. Now you need to decide how to deploy it for 24/7 operation.

---

## Option A: Keep It Local (Easiest, Computer Must Stay On)

### 1. Install Process Manager
```powershell
# Open PowerShell as Administrator
npm install -g pm2
npm install -g pm2-windows-startup
```

### 2. Start All Services
```powershell
# Start Ollama
ollama serve

# In new PowerShell window, start services with PM2
pm2 start ollama-lead-bridge.js --name leads
pm2 start ollama-facebook-content-generator.js --name facebook
pm2 start ollama-content-aggregator.js --name aggregator
pm2 save
```

### 3. Make It Auto-Start
```powershell
pm2-startup install
pm2 save
```

### 4. Expose Webhooks (So GitHub/Zapier Can Reach You)
```powershell
# Download ngrok from ngrok.com, then:
ngrok http 3458

# You'll get a URL like: https://abc123.ngrok.io
# Use this URL in GitHub/Zapier webhooks
```

**✅ Done! Your computer now runs everything 24/7**

**Downsides:**
- Computer must stay on
- Internet must stay connected  
- ngrok URL changes unless you pay $20/month

---

## Option B: Deploy to Azure (Professional, Always On)

### 1. Quick Azure Setup
```powershell
# Login to Azure
az login

# Deploy everything in one command
az webapp up `
  --name "mortgagelc-content" `
  --resource-group "devBigChubbyDog01" `
  --runtime "NODE:18-lts" `
  --sku B1
```

### 2. Set Environment Variables
```powershell
az webapp config appsettings set `
  --name "mortgagelc-content" `
  --resource-group "devBigChubbyDog01" `
  --settings `
    FB_PAGE_TOKEN="your-facebook-token" `
    OLLAMA_HOST="http://ollama-server:11434"
```

### 3. Your URLs Will Be:
- Main: `https://mortgagelc-content.azurewebsites.net`
- Webhooks: `https://mortgagelc-content.azurewebsites.net/webhook/github`
- Dashboard: `https://mortgagelc-content.azurewebsites.net/dashboard`

**✅ Done! Runs 24/7 in the cloud**

**Cost:** ~$45/month

---

## Option C: Hybrid (Best of Both)

### Local Ollama + Cloud Webhooks

1. **Keep Ollama local** (free AI)
2. **Deploy only webhooks to cloud** (always available)
3. **Use Cloudflare Tunnel** (free) to connect them

```powershell
# Install Cloudflare Tunnel
winget install Cloudflare.cloudflared

# Create tunnel
cloudflared tunnel create mortgage-content
cloudflared tunnel route dns mortgage-content content.yourdomain.com

# Run tunnel
cloudflared tunnel run mortgage-content
```

**✅ Free AI + Reliable Webhooks!**

---

## Which Should You Choose?

### Choose LOCAL if:
- Just testing
- Computer already runs 24/7
- Don't mind if it goes offline sometimes
- **Time to implement: 30 minutes**

### Choose AZURE if:
- This is for real business use
- Need 99.9% uptime
- Want professional setup
- **Time to implement: 1 hour**

### Choose HYBRID if:
- Want to save money on AI
- Need reliable webhooks
- Have some technical knowledge
- **Time to implement: 2 hours**

---

## Test Everything Works

```powershell
# Test local services
curl http://localhost:3456/health
curl http://localhost:3457/health
curl http://localhost:3458/health

# Test content generation
curl -X POST http://localhost:3457/generate `
  -H "Content-Type: application/json" `
  -d '{"category":"educational"}'
```

---

## Set Up Your First Automation

### 1. GitHub Actions (Automatic daily posts)
- Go to your GitHub repo
- Add `.github/workflows/content-automation.yml`
- Add secrets: Settings → Secrets → Add:
  - `OLLAMA_WEBHOOK_URL`: Your ngrok or Azure URL
  - `WEBHOOK_TOKEN`: Any secure password

### 2. Zapier (Connect to 5000+ apps)
- Create new Zap at zapier.com
- Trigger: Choose any app (Google Sheets, Email, CRM)
- Action: Webhooks → POST
- URL: `your-url/webhook/zapier`

---

## Monitor Everything

### Simple Monitoring Script
Save as `check-services.ps1`:
```powershell
while ($true) {
    Clear-Host
    Write-Host "=== Service Status ===" -ForegroundColor Cyan
    
    # Check each service
    @(3456, 3457, 3458) | ForEach-Object {
        try {
            $r = Invoke-RestMethod "http://localhost:$_/health"
            Write-Host "Port $_`: OK" -ForegroundColor Green
        } catch {
            Write-Host "Port $_`: DOWN" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 30
}
```

---

## If Something Goes Wrong

### Services won't start?
```powershell
# Kill everything and restart
pm2 kill
pm2 start all
```

### Ollama not working?
```powershell
# Restart Ollama
taskkill /F /IM ollama.exe
ollama serve
```

### Webhooks not receiving?
- Check ngrok is running: `ngrok status`
- Check firewall: Windows Defender might block ports

---

## You're Ready! 🎉

Pick an option above and you'll have automated Facebook content with real-time data in less than an hour!