# TODO List 3: Marketing Team (SEO & Analytics)
## 🔍 TARGET: Maximum Visibility & Tracking | Complete within 24-48 hours

### 🗺️ 1. Technical SEO Implementation

#### 1.1 Create Sitemap.xml
Create `/Website/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://mortgageloans.com/</loc>
    <lastmod>2024-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Pages -->
  <url>
    <loc>https://mortgageloans.com/loan-programs</loc>
    <lastmod>2024-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- City Pages -->
  <url>
    <loc>https://mortgageloans.com/austin-mortgages</loc>
    <lastmod>2024-01-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Add all other pages... -->
</urlset>
```

#### 1.2 Update Robots.txt
Update `/Website/public/robots.txt`:
```
# Mortgage Loans Co Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*.pdf$

# Sitemaps
Sitemap: https://mortgageloans.com/sitemap.xml

# Crawl-delay for bots
User-agent: *
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10
```

#### 1.3 Implement Canonical URLs
- [ ] Add to every page component:
  ```tsx
  <Helmet>
    <link rel="canonical" href={`https://mortgageloans.com${location.pathname}`} />
  </Helmet>
  ```

#### 1.4 Add JSON-LD Structured Data
Create `/Website/src/components/seo/StructuredData.tsx`:
```typescript
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MortgageCompany",
    "name": "Mortgage Loans Co",
    "alternateName": "Big Chubby Dog Inc.",
    "url": "https://mortgageloans.com",
    "logo": "https://mortgageloans.com/logo.png",
    "telephone": "+1-512-820-5714",
    "email": "info@mortgageloans.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78701",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/mortgageloansco",
      "https://www.linkedin.com/company/mortgageloansco",
      "https://twitter.com/mortgageloansco"
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### 📊 2. Analytics & Tracking Setup

#### 2.1 Google Analytics 4 Implementation
- [ ] Create GA4 property in Google Analytics
- [ ] Add to `/Website/index.html`:
  ```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', {
      send_page_view: false // We'll send manually after React renders
    });
  </script>
  ```

#### 2.2 Create Analytics Service
Create `/Website/src/services/analytics/googleAnalytics.ts`:
```typescript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  
  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
  }

  // Page view tracking
  trackPageView(path: string, title?: string) {
    if (typeof window.gtag !== 'function') return;
    
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href
    });
  }

  // Event tracking
  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (typeof window.gtag !== 'function') return;
    
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  // Conversion tracking
  trackConversion(conversionId: string, value?: number) {
    if (typeof window.gtag !== 'function') return;
    
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: 'USD'
    });
  }

  // E-commerce tracking
  trackPurchase(transactionData: any) {
    if (typeof window.gtag !== 'function') return;
    
    window.gtag('event', 'purchase', transactionData);
  }
}

export const ga = GoogleAnalytics.getInstance();
```

#### 2.3 Set Up Conversion Events
- [ ] Form Submission:
  ```typescript
  const handleFormSubmit = () => {
    ga.trackEvent('Form', 'Submit', 'Lead Capture');
    ga.trackConversion('AW-XXXXXXXXX/XXXXXXXXX');
  };
  ```

- [ ] Phone Click:
  ```typescript
  const handlePhoneClick = () => {
    ga.trackEvent('Contact', 'Phone Click', '512-820-5714');
    ga.trackConversion('AW-XXXXXXXXX/YYYYYYYYY');
  };
  ```

- [ ] Calculator Usage:
  ```typescript
  const handleCalculatorComplete = () => {
    ga.trackEvent('Calculator', 'Complete', `Loan Amount: ${loanAmount}`);
  };
  ```

#### 2.4 Facebook Pixel Setup
- [ ] Add to `/Website/index.html`:
  ```html
  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
  </script>
  <noscript>
    <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
  </noscript>
  <!-- End Facebook Pixel Code -->
  ```

### 🏷️ 3. Social Media Integration

#### 3.1 Open Graph Optimization
- [ ] Create OG Image Generator:
  ```typescript
  // For dynamic OG images per page
  export const generateOGImage = (title: string, description: string) => {
    return `https://og-image-generator.vercel.app/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
  };
  ```

#### 3.2 Twitter Card Implementation
- [ ] Add to all pages:
  ```tsx
  <Helmet>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@mortgageloansco" />
    <meta name="twitter:creator" content="@mortgageloansco" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
  </Helmet>
  ```

#### 3.3 Social Media Schema
- [ ] Add social profiles schema:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mortgage Loans Co",
    "sameAs": [
      "https://www.facebook.com/mortgageloansco",
      "https://twitter.com/mortgageloansco",
      "https://www.linkedin.com/company/mortgageloansco",
      "https://www.youtube.com/mortgageloansco",
      "https://www.instagram.com/mortgageloansco"
    ]
  }
  ```

### 📍 4. Local SEO Optimization

#### 4.1 Google My Business Setup
- [ ] Create/claim GMB listing
- [ ] Add all business information:
  - Business name: Mortgage Loans Co
  - Category: Mortgage Lender
  - Phone: 512-820-5714
  - Website: https://mortgageloans.com
  - Hours: Mon-Fri 9AM-6PM
  - Service areas: All Texas cities

#### 4.2 Local Business Schema
- [ ] Add to each city page:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mortgage Loans Co - Austin",
    "image": "https://mortgageloans.com/austin-office.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78701"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.2672,
      "longitude": -97.7431
    },
    "url": "https://mortgageloans.com/austin-mortgages",
    "telephone": "+15128205714",
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }]
  }
  ```

#### 4.3 Local Citations
- [ ] Submit to directories:
  - Yelp Business
  - Yellow Pages
  - Bing Places
  - Apple Maps
  - Foursquare
  - Better Business Bureau
  - Chamber of Commerce (each city)

### 🎯 5. Conversion Rate Optimization

#### 5.1 A/B Testing Setup
- [ ] Install Google Optimize:
  ```html
  <script src="https://www.googleoptimize.com/optimize.js?id=OPT-XXXXXX"></script>
  ```

#### 5.2 Heat Mapping Tool
- [ ] Install Microsoft Clarity:
  ```html
  <script type="text/javascript">
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
  </script>
  ```

#### 5.3 Create UTM Campaign URLs
- [ ] Create tracking spreadsheet with UTM parameters:
  ```
  Facebook Ads: ?utm_source=facebook&utm_medium=cpc&utm_campaign=spring2024
  Google Ads: ?utm_source=google&utm_medium=cpc&utm_campaign=brand
  Email: ?utm_source=email&utm_medium=newsletter&utm_campaign=january
  ```

### 📈 6. Reporting & Monitoring

#### 6.1 Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap
- [ ] Set up email alerts for:
  - Coverage issues
  - Mobile usability problems
  - Security issues

#### 6.2 Set Up Dashboards
- [ ] Google Analytics 4 Dashboard:
  - Real-time users
  - Conversion funnel
  - Traffic sources
  - Landing page performance
  - City-specific traffic

- [ ] Google Data Studio Report:
  - Weekly traffic summary
  - Lead generation metrics
  - Cost per acquisition
  - ROI by channel

#### 6.3 Automated Reports
- [ ] Weekly email reports for:
  - Traffic summary
  - Top performing pages
  - Conversion rates
  - Technical issues

### ✅ 7. Quality Checks

#### 7.1 SEO Validation
- [ ] Run Screaming Frog crawl
- [ ] Check all meta tags populated
- [ ] Verify canonical URLs
- [ ] Test structured data with Google tool
- [ ] Check mobile-friendliness

#### 7.2 Analytics Validation
- [ ] Verify GA4 firing on all pages
- [ ] Test all conversion events
- [ ] Confirm e-commerce tracking
- [ ] Check cross-domain tracking
- [ ] Validate Facebook Pixel events

#### 7.3 Performance Metrics
- [ ] Page load time < 3s
- [ ] Mobile usability score 100
- [ ] No crawl errors
- [ ] All pages indexed
- [ ] Rich results eligible

### 🚀 Launch Day Tasks
1. [ ] Submit sitemap to Google
2. [ ] Submit sitemap to Bing
3. [ ] Announce on social media
4. [ ] Set up Google Alerts
5. [ ] Monitor Search Console
6. [ ] Check all tracking pixels

### 📊 KPIs to Track
- Organic traffic growth
- Conversion rate by source
- Average session duration
- Bounce rate < 40%
- Lead quality score
- Cost per acquisition

---

**Deadline: [Date + 48 hours]**
**Daily Report: 5 PM to marketing@mortgageloans.com**
**Emergency Contact: 512-820-5714**