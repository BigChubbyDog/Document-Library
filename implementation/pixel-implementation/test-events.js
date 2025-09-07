
// Test lead form submission
window.mortgageTracking.trackConversion('Lead', {
  content_name: 'Test Lead Form Submission',
  value: 150,
  currency: 'USD'
}, {
  email: 'test@mortgagelc.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '5551234567',
  city: 'Austin',
  state: 'TX',
  zipCode: '78701'
});


// Test quote request
window.mortgageTracking.trackConversion('InitiateCheckout', {
  content_name: 'Test Quote Request',
  value: 75,
  currency: 'USD'
}, {
  email: 'test@mortgagelc.com'
});


// Test calculator usage
window.mortgageTracking.trackConversion('ViewContent', {
  content_name: 'Test Calculator Usage',
  value: 25,
  currency: 'USD'
});


// Pixel validation script
function validatePixelSetup() {
  console.log('🧪 Validating Facebook Pixel Setup...');
  
  // Check if pixel is loaded
  if (typeof fbq !== 'undefined') {
    console.log('✅ Facebook Pixel loaded successfully');
  } else {
    console.error('❌ Facebook Pixel not loaded');
    return false;
  }
  
  // Check if custom tracking is available
  if (typeof window.mortgageTracking !== 'undefined') {
    console.log('✅ Custom mortgage tracking functions available');
  } else {
    console.error('❌ Custom tracking functions not available');
    return false;
  }
  
  // Test a conversion event
  try {
    window.mortgageTracking.trackConversion('ViewContent', {
      content_name: 'Pixel Validation Test',
      value: 1,
      currency: 'USD'
    });
    console.log('✅ Test conversion event fired');
  } catch (error) {
    console.error('❌ Test conversion failed:', error);
    return false;
  }
  
  console.log('✅ Facebook Pixel validation completed successfully');
  return true;
}

// Run validation when page loads
document.addEventListener('DOMContentLoaded', validatePixelSetup);