# Dynamics 365 Multi-Business Setup Guide

## ✅ Current Status
- **Connected to:** mortgagelcdefault.crm.dynamics.com
- **Organization ID:** 15dd3ba1-a778-f011-8589-000d3a106f2b
- **Authentication:** Working with Claude-Master-Automation service principal
- **Current Business Units:** 1 (mortgagelcdefault - default)

## 🏢 Business Architecture Overview

### Separate Business Profiles
1. **Mortgage Loans Co** - Financial Services
2. **Aura Spring Cleaning** - Professional Services  
3. **Allan Home Group** - Real Estate
4. **Dirty Paws Soap Co** - Retail

### Key Benefits
- **Data Separation**: Each business maintains its own customer data
- **Cross-Business Intelligence**: Share insights across businesses when beneficial
- **Unified Management**: Single Dynamics 365 instance with multiple business units
- **Referral Tracking**: Automated cross-business referral system

## 📋 Manual Configuration Steps

### Step 1: Create Business Units
Navigate to: **Settings → Security → Business Units**

Create these business units:
- **Name:** Mortgage Loans Co
  - **Parent:** mortgagelcdefault
  - **Division:** Financial Services
  
- **Name:** Aura Spring Cleaning
  - **Parent:** mortgagelcdefault
  - **Division:** Professional Services
  
- **Name:** Allan Home Group
  - **Parent:** mortgagelcdefault
  - **Division:** Real Estate
  
- **Name:** Dirty Paws Soap Co
  - **Parent:** mortgagelcdefault
  - **Division:** Retail

### Step 2: Create Teams
Navigate to: **Settings → Security → Teams**

For each business unit, create:
- **Mortgage Loans Team**
  - Business Unit: Mortgage Loans Co
  - Team Type: Owner
  
- **Aura Spring Team**
  - Business Unit: Aura Spring Cleaning
  - Team Type: Owner

- **Allan Home Team**
  - Business Unit: Allan Home Group
  - Team Type: Owner

- **Dirty Paws Team**
  - Business Unit: Dirty Paws Soap Co
  - Team Type: Owner

### Step 3: Configure Security Roles
Navigate to: **Settings → Security → Security Roles**

Create custom roles:
1. **Mortgage Loan Officer**
   - Full access to Leads, Opportunities, Contacts in Mortgage BU
   - Read access to cross-business referrals
   
2. **Cross-Business Manager**
   - Read access across all business units
   - Write access to cross-business links
   
3. **Service Manager (Aura Spring)**
   - Full access to service appointments in Aura BU
   - Read access to customer data

### Step 4: Add Custom Fields for Mortgage Loans

#### On Lead Entity
Navigate to: **Settings → Customizations → Customize the System → Entities → Lead → Fields**

Add these fields:
| Field Name | Display Name | Type | Options |
|------------|--------------|------|---------|
| new_loantype | Loan Type | Option Set | Purchase, Refinance, HELOC, Cash-Out, FHA, VA, Conventional |
| new_purchaseprice | Purchase Price | Currency | - |
| new_downpaymentamount | Down Payment | Currency | - |
| new_creditscorerange | Credit Score | Option Set | 300-579, 580-619, 620-679, 680-739, 740-799, 800-850 |
| new_mortgageleadscore | Lead Score | Whole Number | 0-100 |
| new_referralsource | Referral Source | Option Set | AllanHome, AuraSpring, Website, Referral, Social Media |
| new_qualificationstatus | Qualification | Option Set | New, Contacting, Qualified, Unqualified, Nurturing |
| new_estimatedloanamount | Est. Loan Amount | Currency | - |
| new_dti_ratio | DTI Ratio | Decimal | - |
| new_ltv_ratio | LTV Ratio | Decimal | - |

#### On Opportunity Entity
Navigate to: **Settings → Customizations → Customize the System → Entities → Opportunity → Fields**

Add these fields:
| Field Name | Display Name | Type | Options |
|------------|--------------|------|---------|
| new_loanapplicationnumber | Application # | Single Line Text | - |
| new_loanamount | Loan Amount | Currency | - |
| new_interestrate | Interest Rate | Decimal | - |
| new_loanterm | Loan Term | Whole Number | Months |
| new_loanstage | Loan Stage | Option Set | Application, Processing, Underwriting, Approved, Closing, Funded, Cancelled |
| new_crossbusinessopportunity | Cross-Business | Two Options | Yes/No |
| new_linkedbusiness | Linked Business | Single Line Text | - |
| new_appraisalvalue | Appraisal Value | Currency | - |
| new_cleartoclosedate | Clear to Close | Date Only | - |
| new_compliancestatus | Compliance | Option Set | Pending, InReview, Approved, Issues |

#### On Contact Entity
Navigate to: **Settings → Customizations → Customize the System → Entities → Contact → Fields**

Add these fields:
| Field Name | Display Name | Type | Options |
|------------|--------------|------|---------|
| new_businessunits | Business Units | Multiple Lines Text | JSON Array |
| new_customertype | Customer Type | Option Set | Borrower, CoBorrower, Realtor, ReferralPartner |
| new_totalloansoriginated | Total Loans | Whole Number | - |
| new_creditscore | Credit Score | Whole Number | - |
| new_crossselleligible | Cross-Sell Eligible | Two Options | Yes/No |
| new_verifiedincome | Verified Income | Currency | - |
| new_debttoincomeratio | DTI Ratio | Decimal | - |

### Step 5: Create Custom Entity (Optional)
Navigate to: **Settings → Customizations → Customize the System → Entities → New**

Create **Loan Application** entity:
- **Display Name:** Loan Application
- **Plural Name:** Loan Applications
- **Name:** new_loanapplication
- **Ownership:** User or Team
- **Activities:** Enable
- **Notes:** Enable

Fields to add:
- Application Number (Primary field)
- Applicant Contact (Lookup to Contact)
- Related Opportunity (Lookup to Opportunity)
- Application Status (Option Set)
- Submission Date (Date/Time)
- Decision Date (Date/Time)
- Requested Amount (Currency)
- Approved Amount (Currency)
- Final Rate (Decimal)
- Monthly Payment (Currency)

### Step 6: Configure Business Process Flows
Navigate to: **Settings → Customizations → Customize the System → Processes**

Create **Mortgage Application Process**:
1. Lead Qualification
2. Application Submission
3. Document Collection
4. Underwriting Review
5. Approval/Conditions
6. Clear to Close
7. Closing
8. Funding

### Step 7: Set Up Cross-Business Views
Navigate to: **Settings → Customizations → Customize the System → Entities → Contact → Views**

Create **Cross-Business Customers** view:
- Filter: Cross-Sell Eligible = Yes
- Columns: Name, Email, Phone, Business Units, Customer Type, Lifetime Value

## 🔧 Implementation Code

### TypeScript Service Usage
```typescript
import dynamicsService from './dynamics365-mortgage-service';

// Create mortgage lead
const lead = await dynamicsService.createMortgageLead({
  firstname: 'John',
  lastname: 'Smith',
  emailaddress1: 'john@example.com',
  new_loantype: 'Purchase',
  new_purchaseprice: 500000,
  new_creditscorerange: '740-799',
  new_referralsource: 'AllanHome'
});

// Check cross-business opportunities
const sharedData = await dynamicsService.getSharedCustomerData('john@example.com');
```

### PowerShell Testing
```powershell
# Test multi-business setup
.\test-dynamics365-simple.ps1

# View configuration
Get-Content C:\Users\dusta\dynamics365-connection-test.json | ConvertFrom-Json
```

## 📊 Cross-Business Synergies

### Referral Flow
```
Allan Home Group (Real Estate)
    ↓ (Home purchase/sale)
Mortgage Loans Co
    ↓ (Loan closed)
Aura Spring Cleaning
    ↓ (Pet detected)
Dirty Paws Soap Co
```

### Automated Triggers
1. **Allan Home → Mortgage**: New home listing or buyer creates mortgage lead
2. **Mortgage → Aura Spring**: Closed loan triggers cleaning service offer
3. **Aura Spring → Dirty Paws**: Pet cleaning service triggers pet product offers

## 🔐 Security Considerations

### Data Access Rules
- **Default**: Users only see data in their business unit
- **Cross-Business Managers**: Read-only access across units
- **System Administrators**: Full access to all units

### Sharing Rules
- Contacts can be shared across business units
- Opportunities remain private to business unit
- Cross-business links tracked in separate entity

## 📈 Reporting & Analytics

### Business Unit Dashboards
Each business unit gets:
- Lead conversion rates
- Revenue by source
- Cross-business referral success
- Customer lifetime value

### Executive Dashboard
Unified view showing:
- Total revenue across businesses
- Cross-sell success rates
- Business unit performance
- Referral network effectiveness

## 🚀 Next Steps

1. **Complete manual configuration** in Dynamics 365 admin center
2. **Test business unit creation** with sample data
3. **Configure automated workflows** for cross-business referrals
4. **Set up reporting** dashboards for each business
5. **Train team members** on new structure

## 📞 Support Resources

- **Dynamics 365 Documentation**: https://docs.microsoft.com/dynamics365
- **Service Principal**: Claude-Master-Automation (System Admin)
- **Technical Contact**: dustin@bigchubbydog.com

---

*Last Updated: 2025-08-19*
*Configuration Status: Implementation Ready*