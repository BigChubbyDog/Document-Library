# ⚡ QUICK START GUIDE
## Get Your System Running in 10 Minutes

---

## 🚀 IMMEDIATE ACTIONS

### Step 1: Start Test Server (30 seconds)
```bash
cd C:\Users\dusta\Desktop
node complete-working-test-server.js
```
**Open**: http://localhost:3006

### Step 2: Submit Test Lead (1 minute)
1. Click "🎲 Generate Random Lead" 
2. Watch the live activity feed
3. See all 9 systems update in real-time

### Step 3: Verify Systems (2 minutes)
Check that you see:
- ✅ Score calculated (0-100)
- ✅ Priority assigned (FIRE/HOT/WARM)
- ✅ Claude AI response
- ✅ D365 records created
- ✅ Notifications sent
- ✅ Campaign deployed

---

## 📊 WHAT'S RUNNING NOW

### Port 3004 - CTA Tester
```bash
node test-all-ctas.js
```
- Tests every button type
- Shows trigger activation
- Live scoring display

### Port 3005 - Zapier Hub
```bash
node zapier-orchestration-hub.js
```
- Complete orchestration
- All lead types
- Full drip campaigns

### Port 3006 - Complete System
```bash
node complete-working-test-server.js
```
- Full working dashboard
- Real-time processing
- Live activity feed
- System reports

---

## 🎯 TEST DIFFERENT LEAD TYPES

### 🔥 FIRE Lead (Immediate Response)
```javascript
{
  lead_type: "instant_fast",
  loan_amount: 600000,
  credit_score: 780,
  urgency: "immediate"
}
// Result: 5-minute callback required
```

### 🌡️ HOT Lead (2-Hour Response)
```javascript
{
  lead_type: "rate_lock",
  loan_amount: 450000,
  credit_score: 720,
  urgency: "immediate"
}
// Result: Rate lock confirmation
```

### 💰 Calculator Lead (Education)
```javascript
{
  lead_type: "calculator",
  monthly_payment: 3000,
  down_payment: 50000
}
// Result: Affordability report
```

---

## 📈 MONITORING

### Real-Time Stats
- **Total Leads**: Updates every 5 seconds
- **FIRE Leads**: Urgent count
- **Emails Sent**: Total dispatched
- **Commission**: Running total

### View Reports
- **Full Report**: http://localhost:3006/api/report/full
- **Claude Responses**: http://localhost:3006/api/report/claude
- **D365 Records**: http://localhost:3006/api/report/d365
- **Active Campaigns**: http://localhost:3006/api/report/campaigns

---

## 💡 QUICK TESTS

### Test 1: Urgent Lead
1. Select "⚡ Instant (5 min response)"
2. Set Credit Score: 780
3. Set Urgency: Immediate
4. Submit → Should see 🔥 FIRE priority

### Test 2: Calculator Lead  
1. Select "💰 Calculator"
2. Enter any values
3. Submit → Should see affordability analysis

### Test 3: Random Testing
1. Click "🎲 Generate Random Lead" repeatedly
2. Watch different priorities assigned
3. See various campaigns deploy

---

## 🔧 TROUBLESHOOTING

### Nothing happening?
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Restart server
node complete-working-test-server.js
```

### Port already in use?
```bash
# Use different port
PORT=3007 node complete-working-test-server.js
```

### Need to see logs?
```bash
# Check console output
# All activity is logged in real-time
```

---

## 📱 WHAT YOU'RE SEEING

### When Lead Score ≥90 (🔥 FIRE)
- SMS notification (simulated)
- Urgent email sent
- Teams alert posted
- 5-minute task created
- Calendar event scheduled

### When Lead Score 75-89 (🌡️ HOT)
- Email sent
- Teams notification
- 2-hour follow-up task
- Standard campaign

### When Lead Score <75 (WARM/COOL/COLD)
- Email queued
- Education campaign
- Long-term nurture

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when you see:

1. **Activity Feed Updates**
   - New items appear instantly
   - Color coding (red for urgent)
   - System counts increase

2. **Stats Dashboard**
   - Numbers increment
   - Commission calculates
   - Lead counts grow

3. **Console Output**
   - Detailed processing logs
   - Step-by-step execution
   - Success confirmations

---

## 🚦 NEXT STEPS

### Today
1. ✅ Run test server
2. ✅ Submit 10 test leads
3. ✅ Verify all systems work

### Tomorrow
1. Deploy Zapier CLI app
2. Configure real webhooks
3. Connect production services

### This Week
1. Launch with real leads
2. Monitor performance
3. Optimize based on results

---

## 📞 QUICK COMMANDS

```bash
# Start everything
node complete-working-test-server.js

# View activity
http://localhost:3006

# Check stats
http://localhost:3006/api/stats

# Full report
http://localhost:3006/api/report/full

# Stop everything
Ctrl+C
```

---

**YOUR SYSTEM IS READY! Start with the test server and see the magic happen!** 🚀

*Test at least 10 leads of different types to see the full range of system responses*