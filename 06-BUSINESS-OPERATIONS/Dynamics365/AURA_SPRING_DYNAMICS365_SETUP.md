# Aura Spring Cleaning - Dynamics 365 Complete Setup Guide

## 🏢 Business Profile Overview

**Company:** Aura Spring Cleaning  
**Industry:** Professional Cleaning Services  
**Location:** Austin, TX  
**Service Area:** Greater Austin Metro  
**Team Size:** 10-15 cleaners  

## 🎯 Optimized Architecture Features

### Core Capabilities
1. **Smart Team Scheduling** - AI-powered team assignment based on performance metrics
2. **Route Optimization** - Minimize travel time between properties
3. **Quality Control System** - 10-point inspection with photo documentation
4. **Recurring Service Automation** - Automatic scheduling and reminders
5. **Dynamic Pricing Engine** - Size, type, frequency-based pricing
6. **Performance Tracking** - Individual and team metrics
7. **Customer Property Profiles** - Detailed preferences and history
8. **Supply & Equipment Management** - Track needs per service

## 📊 Custom Entities for Aura Spring

### 1. Cleaning Service Record (`new_cleaningservices`)
Primary entity for managing individual cleaning appointments.

**Key Fields:**
| Field Name | Purpose | Type |
|------------|---------|------|
| new_servicenumber | Unique identifier (ASC-XXXXX) | Auto-generated |
| new_servicetype | Standard/Deep/Move-in/Office/etc | Option Set |
| new_servicedate | Scheduled service date | Date |
| new_servicestatus | Scheduled/InProgress/Completed | Option Set |
| new_teammembers | Assigned cleaning team | JSON Array |
| new_totalprice | Calculated service price | Currency |
| new_qualityscore | QC inspection score (1-100) | Number |
| new_beforephotos | Before cleaning photos | URLs |
| new_afterphotos | After cleaning photos | URLs |
| new_customerrating | Customer satisfaction (1-5) | Number |
| new_profitmargin | Calculated profit percentage | Decimal |

### 2. Cleaning Property (`new_cleaningproperties`)
Detailed property information and preferences.

**Key Fields:**
| Field Name | Purpose | Type |
|------------|---------|------|
| new_propertynumber | Property ID (PROP-XXXXX) | Auto-generated |
| new_address | Full property address | Text |
| new_squarefeet | Property size | Number |
| new_bedrooms | Number of bedrooms | Number |
| new_bathrooms | Number of bathrooms | Number |
| new_accessmethod | Key/Code/Lockbox/Present | Option Set |
| new_haspets | Pet presence flag | Yes/No |
| new_preferredteam | Preferred cleaning team | Lookup |
| new_chemicalpreferences | Standard/Eco/Hypoallergenic | Option Set |
| new_lifetimerevenue | Total revenue from property | Currency |
| new_averagequalityscore | Average QC score | Number |

### 3. Team Member (`new_teammembers`)
Cleaner profiles and performance tracking.

**Key Fields:**
| Field Name | Purpose | Type |
|------------|---------|------|
| new_employeeid | Employee ID (EMP-XXXXX) | Auto-generated |
| new_role | Lead/Cleaner/Supervisor/Trainee | Option Set |
| new_performancecore | Overall performance (1-100) | Number |
| new_qualityscore | Average quality score | Number |
| new_speedscore | Efficiency metric | Number |
| new_customersatisfaction | Average rating | Decimal |
| new_availability | Weekly schedule | JSON |
| new_certifications | Special training/certs | JSON Array |
| new_preferredpartners | Compatible team members | JSON Array |

### 4. Recurring Service (`new_recurringservices`)
Manage recurring cleaning contracts.

**Key Fields:**
| Field Name | Purpose | Type |
|------------|---------|------|
| new_contractnumber | Contract ID (RC-XXXXX) | Auto-generated |
| new_frequency | Weekly/Biweekly/Monthly | Option Set |
| new_preferredday | Preferred service day | Text |
| new_standardprice | Regular service price | Currency |
| new_discountpercent | Frequency discount | Number |
| new_contractvalue | Annual contract value | Currency |
| new_nextservicedate | Next scheduled cleaning | Date |
| new_autoconfirm | Auto-confirm appointments | Yes/No |

### 5. Quality Control (`new_qualitycontrols`)
Post-service quality inspections.

**Key Fields:**
| Field Name | Purpose | Type |
|------------|---------|------|
| new_serviceid | Related service | Lookup |
| new_kitchen | Kitchen score (1-10) | Number |
| new_bathrooms | Bathrooms score (1-10) | Number |
| new_bedrooms | Bedrooms score (1-10) | Number |
| new_floors | Floors score (1-10) | Number |
| new_finalscore | Overall score (1-100) | Number |
| new_passorfail | Pass/Fail/Conditional | Option Set |
| new_requiresrework | Needs follow-up | Yes/No |

## 🤖 AI-Powered Features

### 1. Smart Team Assignment Algorithm
```typescript
// Factors considered:
- Team member performance scores (40% weight)
- Customer satisfaction ratings (30% weight)
- Speed/efficiency metrics (20% weight)
- Team compatibility (10% weight)
- Geographic proximity
- Special certifications required
- Language preferences
```

### 2. Dynamic Pricing Engine
```typescript
// Base pricing by square footage:
- Under 1,000 sq ft: $89
- 1,001-1,500 sq ft: $119
- 1,501-2,000 sq ft: $149
- 2,001-2,500 sq ft: $179
- 2,501-3,000 sq ft: $209
- Over 3,000: $209 + $30 per 500 sq ft

// Service type multipliers:
- Standard: 1.0x
- Deep Clean: 1.5x
- Move In/Out: 1.8x
- Post-Construction: 2.0x
- Emergency: 2.5x

// Frequency discounts:
- Weekly: 20% off
- Biweekly: 15% off
- Monthly: 10% off
- Quarterly: 5% off
```

### 3. Quality Score Calculation
```typescript
// 10-point inspection areas:
1. Kitchen (10%)
2. Bathrooms (15%)
3. Bedrooms (10%)
4. Living Areas (10%)
5. Floors (15%)
6. Dusting (10%)
7. Windows (10%)
8. Trash/Recycling (5%)
9. Overall Appearance (10%)
10. Special Requests (5%)

// Score thresholds:
- 80-100: Pass (Excellent)
- 60-79: Conditional (Needs Improvement)
- Below 60: Fail (Requires Rework)
```

## 📋 Implementation Steps

### Step 1: Create Business Unit
Navigate to: **Settings → Security → Business Units**

```
Name: Aura Spring Cleaning
Parent: mortgagelcdefault
Division: Professional Services
Manager: Valerie Boatman
```

### Step 2: Create Custom Entities
Navigate to: **Settings → Customizations → Customize System → New Entity**

Create these entities in order:
1. **Cleaning Properties** (new_cleaningproperties)
2. **Team Members** (new_teammembers)
3. **Cleaning Services** (new_cleaningservices)
4. **Recurring Services** (new_recurringservices)
5. **Quality Controls** (new_qualitycontrols)

### Step 3: Configure Security Roles
Create these roles:
1. **Cleaning Service Manager**
   - Full access to all cleaning entities
   - Can view financial reports
   - Manage team assignments

2. **Team Lead**
   - Update service records
   - Perform quality inspections
   - View team schedules

3. **Cleaner**
   - View assigned services
   - Update service status
   - Upload photos

4. **Office Administrator**
   - Manage customer records
   - Schedule services
   - Process payments

### Step 4: Set Up Business Process Flows

**Service Completion Flow:**
1. Service Scheduled
2. Team Assigned
3. En Route
4. Service In Progress
5. Quality Check
6. Customer Approval
7. Payment Processing
8. Feedback Collection

**New Customer Onboarding:**
1. Initial Contact
2. Property Assessment
3. Quote Generation
4. Contract Agreement
5. First Service Scheduled
6. Property Profile Created
7. Recurring Schedule Set

### Step 5: Configure Automated Workflows

1. **48-Hour Reminder**
   - Trigger: 2 days before service
   - Action: Send SMS/email to customer
   - Include: Date, time, team lead name

2. **Team Assignment**
   - Trigger: New service created
   - Action: Run optimization algorithm
   - Output: Assign team members

3. **Quality Alert**
   - Trigger: QC score < 70
   - Action: Notify supervisor
   - Create: Follow-up task

4. **Recurring Service Generator**
   - Trigger: Service completed
   - Check: Recurring contract exists
   - Action: Create next appointment

## 📊 Dashboards & Reports

### Service Manager Dashboard
- Today's services map view
- Team utilization rates
- Revenue tracking (daily/weekly/monthly)
- Quality scores trend
- Customer satisfaction metrics
- Profit margins by service type

### Team Performance Dashboard
- Individual performance scores
- Services completed per member
- Average quality ratings
- Customer feedback
- Training status
- Availability overview

### Customer Insights Dashboard
- Active properties heat map
- Retention rate
- Lifetime value distribution
- Service frequency analysis
- Churn risk indicators
- Growth opportunities

## 🔗 Integrations

### Microsoft Teams Integration
```typescript
// Notifications sent for:
- New service assignments
- Schedule changes
- Quality issues
- Customer feedback
- Emergency requests
```

### Calendar Sync
```typescript
// Syncs with:
- schedule@auraspringcleaning.com
- Individual team member calendars
- Customer booking confirmations
```

### SharePoint Document Management
```typescript
// Folder structure:
/Customers
  /{CustomerName}
    /Properties
      /{PropertyAddress}
        /ServiceReports
        /BeforeAfterPhotos
        /Invoices
        /QualityReports
```

## 💰 Financial Tracking

### Revenue Metrics
- Average ticket size: $150-200
- Recurring vs one-time: 70/30 split
- Profit margin target: 35-40%
- Customer acquisition cost: $50-75
- Lifetime value: $3,000-5,000

### Cost Analysis
- Labor: 45-50% of revenue
- Supplies: 8-10% of revenue
- Transportation: 5-7% of revenue
- Overhead: 15-20% of revenue
- Target profit: 35-40% of revenue

## 🚀 Quick Start Commands

### Test the System
```powershell
# Import the module
Import-Module "C:\dev\BigChubbyDog\01-BUSINESSES\AuraSpring\src\dynamics365-auraspring-service.ts"

# Create test service
$service = @{
    new_servicetype = "Standard"
    new_servicedate = (Get-Date).AddDays(2)
    new_starttime = "09:00"
    new_squarefeet = 2000
    new_bedrooms = 3
    new_bathrooms = 2
}

# Create appointment
auraSpringService.createServiceAppointment($service)
```

### View Performance Metrics
```typescript
// Get this month's metrics
const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const endDate = new Date();
const metrics = await auraSpringService.getServiceMetrics(startDate, endDate);

console.log(`
  Services Completed: ${metrics.completedServices}
  Total Revenue: $${metrics.totalRevenue}
  Avg Quality Score: ${metrics.averageQualityScore}/100
  Avg Customer Rating: ${metrics.averageCustomerRating}/5
  Profit Margin: ${metrics.averageProfitMargin}%
`);
```

## 📱 Mobile Access

Team members can access via Dynamics 365 mobile app to:
- View daily schedule
- Update service status
- Upload before/after photos
- Complete quality checklists
- Log time and notes
- View property details
- Access customer preferences

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)
1. **Service Quality**: Target 85+ average QC score
2. **Customer Satisfaction**: Target 4.5+ star rating
3. **Team Utilization**: Target 80% productive time
4. **On-Time Arrival**: Target 95% within 15 minutes
5. **Retention Rate**: Target 85% customer retention
6. **Profit Margin**: Target 35-40% per service

### Growth Targets
- Month 1: 50 services
- Month 3: 150 services
- Month 6: 300 services
- Year 1: 500+ recurring customers
- Year 2: Expand to 2nd market

## 🔒 Data Security

### Customer Data Protection
- PCI compliance for payment data
- Encrypted storage of access codes
- Role-based access control
- Audit trail for all changes
- Regular security reviews

### Team Member Privacy
- Separate personal from performance data
- Consent for location tracking
- Secure credential storage
- GDPR/CCPA compliance

## 📞 Support & Training

### Training Resources
1. Video tutorials for each role
2. Quick reference guides
3. Monthly team training sessions
4. Quality standards documentation
5. Safety protocols

### Support Channels
- Help Desk: support@auraspringcleaning.com
- Manager Hotline: (737) 330-1489
- Teams Channel: #aura-dynamics-help
- Documentation: SharePoint/Training

---

*Implementation Guide Version 2.0*  
*Last Updated: 2025-08-20*  
*Status: Ready for Deployment*