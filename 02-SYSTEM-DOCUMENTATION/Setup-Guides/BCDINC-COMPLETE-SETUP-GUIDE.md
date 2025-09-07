# 🚀 BCD INC COMPLETE SETUP GUIDE
## Multi-Company Dynamics 365 + Microsoft 365 Business Pro Configuration

---

## 📊 CURRENT STATUS
- **Environment**: BCD Inc (`https://bcdinc.crm.dynamics.com`)
- **Authentication**: ✅ Working
- **Entities Created**: 0/20 (None yet)
- **M365 Integration**: Not configured
- **Business Units**: Not set up

---

## 🔑 STEP 1: ADD SERVICE PRINCIPAL (REQUIRED FIRST)

### Go to: https://make.powerapps.com
1. Select **BCD Inc** environment (top right)
2. Navigate to: **Settings** (gear icon) → **Security** → **Application Users**
3. Click **+ New app user**
4. In the dialog:
   - **Application ID**: `8b01f8e9-18d3-40d4-90c1-9777f6288bce`
   - Click **Add**
5. Set:
   - **Business Unit**: BCD Inc (root)
   - **Security Roles**: Select **System Administrator**
6. Click **Create**

✅ **Once complete, all automation scripts will work!**

---

## 📦 STEP 2: CREATE ALL 20 ENTITIES

### Method 1: Browser Console (Recommended - Fastest)
1. Open: **https://bcdinc.crm.dynamics.com**
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Type: `allow pasting` (if prompted)
5. Copy entire contents of: `C:\Users\dusta\setup-bcdinc-all-companies.js`
6. Paste in console and press **Enter**
7. Wait ~2 minutes for all entities to create

### Method 2: PowerShell (Alternative)
```powershell
cd C:\Users\dusta\dynamics365-multi-company-setup
python dynamics365_automation.py
```

### Entities Being Created:
| Company | Entities | Purpose |
|---------|----------|---------|
| **Aura Spring Cleaning** | asc_cleaningservice<br>asc_cleaningproperty<br>asc_teammember<br>asc_recurringservice<br>asc_qualitycontrol | Cleaning service management |
| **Mortgage Loans Co** | mlc_loanapplication<br>mlc_borrower<br>mlc_property<br>mlc_underwriting<br>mlc_document | Loan processing system |
| **Allan Home Group** | ahg_listing<br>ahg_showing<br>ahg_offer<br>ahg_transaction<br>ahg_commission | Real estate management |
| **Dirty Paws Soap** | dps_product<br>dps_order<br>dps_subscription<br>dps_inventory<br>dps_supplier | E-commerce & inventory |

---

## 🏢 STEP 3: CREATE BUSINESS UNITS

### Go to: https://make.powerapps.com
1. **Settings** → **Security** → **Business Units**
2. Create this structure:

```
BCD Inc (Root - Already exists)
├── Aura Spring Cleaning
├── Mortgage Loans Co
├── Allan Home Group
└── Dirty Paws Soap
```

For each business unit:
1. Click **+ New**
2. Set:
   - **Name**: [Company Name]
   - **Parent Business**: BCD Inc
3. **Save & Close**

---

## 🔗 STEP 4: ENABLE MICROSOFT 365 INTEGRATION

### A. Enable Office 365 Integration
1. Go to: **Settings** → **Administration** → **System Settings**
2. **General** tab
3. Check: ✅ **Use Microsoft 365 features**
4. Check: ✅ **Enable embedding of certain Office 365 content**
5. **Save**

### B. Enable Teams Integration
1. Go to: **Settings** → **Features**
2. Find **Microsoft Teams Integration**
3. Toggle: **ON**
4. Select: **All Dynamics 365 apps**
5. **Save**

### C. Configure SharePoint Document Management
1. Go to: **Settings** → **Document Management**
2. Click **Enable server-based SharePoint integration**
3. Enter SharePoint URL: `https://bcdinc.sharepoint.com`
4. Click **Next** → **Enable**

### D. Configure Exchange/Outlook
1. Go to: **Settings** → **Email Configuration**
2. Click **Email Server Profiles**
3. Click **+ New**
4. Select: **Exchange Online**
5. Auto-discover settings
6. **Save**

---

## 👥 STEP 5: CONFIGURE SECURITY ROLES

Create custom roles for each business:

### Go to: Settings → Security → Security Roles
1. **Aura Spring Cleaning Roles**:
   - Cleaning Manager
   - Team Member
   - Quality Inspector

2. **Mortgage Loans Co Roles**:
   - Loan Officer
   - Underwriter
   - Processor

3. **Allan Home Group Roles**:
   - Real Estate Agent
   - Broker
   - Transaction Coordinator

4. **Dirty Paws Soap Roles**:
   - Store Manager
   - Inventory Manager
   - Customer Service

---

## 🎯 STEP 6: CONFIGURE BUSINESS PROCESS FLOWS

### For Each Company, Create Relevant Flows:

**Aura Spring Cleaning**:
- New Customer Onboarding
- Service Request → Completion
- Quality Inspection Process

**Mortgage Loans Co**:
- Application → Approval → Funding
- Document Collection Process
- Underwriting Workflow

**Allan Home Group**:
- Listing → Showing → Offer → Closing
- Commission Calculation
- Property Marketing

**Dirty Paws Soap**:
- Order → Fulfillment → Shipping
- Subscription Management
- Inventory Restock

---

## 🔄 STEP 7: TEST & VERIFY

### Run Verification Script:
```powershell
.\check-and-optimize-bcdinc.ps1
```

### Manual Verification:
1. Go to: **Settings** → **Customizations** → **Customize the System**
2. Expand **Entities**
3. Verify all 20 entities appear
4. Check each has proper fields

---

## 📱 STEP 8: MICROSOFT 365 APPS INTEGRATION

### Teams App
1. In Teams: **Apps** → **Dynamics 365**
2. Add to teams/channels for each business unit

### Outlook App
1. In Outlook: **Get Add-ins** → **Dynamics 365**
2. Enable for all users

### SharePoint Sites
1. Create site for each business unit
2. Link to respective Dynamics entities

### Power BI Dashboards
1. Connect Power BI to Dataverse
2. Create dashboards for each business

---

## 🚀 QUICK START COMMANDS

### Check Everything:
```powershell
.\check-and-optimize-bcdinc.ps1
```

### Create All Entities:
```javascript
// In browser console at https://bcdinc.crm.dynamics.com
// Paste contents of setup-bcdinc-all-companies.js
```

### Test Connection:
```powershell
.\test-bcdinc-connection.ps1
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Service Principal added as Application User
- [ ] All 20 entities created
- [ ] 4 Business Units configured
- [ ] Microsoft 365 integration enabled
- [ ] Teams integration active
- [ ] SharePoint document management configured
- [ ] Exchange/Outlook connected
- [ ] Security roles created
- [ ] Business process flows configured
- [ ] Power BI dashboards connected

---

## 📞 SUPPORT

**All automation scripts location**: `C:\Users\dusta\dynamics365-multi-company-setup\`

**Key Files**:
- `setup-bcdinc-all-companies.js` - Creates all entities
- `check-and-optimize-bcdinc.ps1` - Checks environment
- `test-bcdinc-connection.ps1` - Tests authentication

**Environment Details**:
- URL: `https://bcdinc.crm.dynamics.com`
- Tenant: `753965c2-2a85-437e-a9c9-9f824df99584`
- Service Principal: `8b01f8e9-18d3-40d4-90c1-9777f6288bce`

---

*Generated: August 20, 2025*
*Ready for full multi-company operations with Microsoft 365 Business Pro!*