
# Facebook Pixel Implementation Guide

## 1. Base Pixel Installation
Add the base pixel code to the <head> section of all pages:
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

  // Initialize Meta Pixel with advanced matching
  fbq('init', '1072334595033391', {
    // Advanced matching parameters (automatically filled when available)
    em: 'hashed_email',
    ph: 'hashed_phone', 
    fn: 'hashed_first_name',
    ln: 'hashed_last_name',
    ct: 'hashed_city',
    st: 'hashed_state',
    zp: 'hashed_zip'
  });
  
  // Track initial page view
  fbq('track', 'PageView');
  
  // Enhanced tracking for mortgage-specific data
  window.mortgageTracking = {
    trackConversion: function(eventName, customData = {}, customerData = {}) {
      const eventData = {
        content_category: 'mortgage_services',
        content_name: customData.content_name || 'mortgage_conversion',
        value: customData.value || 100,
        currency: 'USD'
      };
      
      // Add customer data if available (will be hashed automatically)
      const userData = {};
      if (customerData.email) userData.em = customerData.email;
      if (customerData.phone) userData.ph = customerData.phone;
      if (customerData.firstName) userData.fn = customerData.firstName;
      if (customerData.lastName) userData.ln = customerData.lastName;
      if (customerData.city) userData.ct = customerData.city;
      if (customerData.state) userData.st = customerData.state;
      if (customerData.zipCode) userData.zp = customerData.zipCode;
      
      fbq('track', eventName, eventData, userData);
      console.log('Meta Pixel - Tracked:', eventName, eventData);
    }
  };
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id=1072334595033391&ev=PageView&noscript=1" />
</noscript>
<!-- End Facebook Pixel Code -->
```

## 2. Conversion Event Setup

### Lead Form Submission
- Trigger: Form submission on mortgage application pages
- Event: Lead
- Value: $150
- Implementation: Automatically triggered on form submit

### Quote Request  
- Trigger: Rate quote form submission
- Event: InitiateCheckout
- Value: $75
- Implementation: Automatically triggered on quote form submit

### Pre-approval Start
- Trigger: Pre-approval application start
- Event: AddToCart  
- Value: $100
- Implementation: Triggered when pre-approval process begins

### Calculator Usage
- Trigger: Mortgage calculator interaction
- Event: ViewContent
- Value: $25
- Implementation: Triggered on calculator page load and interaction

### Consultation Booking
- Trigger: Appointment booking form
- Event: Schedule
- Value: $125
- Implementation: Custom event for consultation bookings

### Loan Application
- Trigger: Complete loan application submission
- Event: Purchase
- Value: $300
- Implementation: Final conversion event

### Email Signup
- Trigger: Newsletter subscription
- Event: Subscribe
- Value: $15
- Implementation: Email capture forms

## 3. Advanced Matching Setup
The pixel is configured with advanced matching to improve attribution:
- Email addresses (hashed)
- Phone numbers (hashed)
- Names (hashed)
- Location data (hashed)

## 4. Testing
Use Facebook's Pixel Helper browser extension to verify:
1. Base pixel fires on all pages
2. Conversion events fire correctly
3. Advanced matching data is captured
4. Server-side events are received (if implemented)

## 5. Verification
Check in Facebook Events Manager:
- View pixel activity
- Monitor conversion events
- Verify advanced matching quality
- Review audience building
