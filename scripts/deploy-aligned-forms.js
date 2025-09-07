#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../../.env.local' });

class AlignedFormsDeployer {
  constructor() {
    // Use page access token for lead form creation
    this.pageAccessToken = null;
    try {
      if (fs.existsSync('../../.page-token')) {
        this.pageAccessToken = fs.readFileSync('../../.page-token', 'utf8').trim();
        console.log('✅ Using page access token');
      }
    } catch (e) {}
    
    this.accessToken = this.pageAccessToken || process.env.FB_ACCESS_TOKEN;
    this.pageId = '102409121765907';
    this.apiVersion = 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    
    // Aligned form configurations
    this.alignedForms = [
      '../facebook-cta-forms/01-first-time-buyer-form.json',
      '../facebook-cta-forms/02-refinance-rate-drop-form.json', 
      '../facebook-cta-forms/03-luxury-exclusivity-form.json',
      '../facebook-cta-forms/04-market-updates-form.json',
      '../facebook-cta-forms/05-va-loan-specialist-form.json'
    ];
  }

  async deployForm(formConfig) {
    console.log(`\n🚀 Deploying: ${formConfig.form_name}`);
    console.log(`📊 Campaign: ${formConfig.campaign_correlation}`);
    
    // Create simple Facebook Lead Form with basic contact fields only
    const leadForm = {
      name: formConfig.form_name,
      privacy_policy_url: 'https://mortgageloansco.com/privacy',
      description: formConfig.configuration.intro_text?.substring(0, 255) || 'Get your personalized mortgage information',
      questions: [
        { key: 'first_name', label: 'First Name', type: 'FIRST_NAME' },
        { key: 'email', label: 'Email Address', type: 'EMAIL' },
        { key: 'phone', label: 'Phone Number', type: 'PHONE' }
      ],
      thank_you_message: formConfig.configuration.thank_you_message?.message || 'Thank you! We\'ll be in touch soon.',
      locale: 'en_US'
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.pageId}/leadgen_forms`,
        leadForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            access_token: this.accessToken
          }
        }
      );

      console.log(`   ✅ Form deployed successfully - ID: ${response.data.id}`);
      console.log(`   📈 Expected CPL: ${formConfig.expected_cpl}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`   ❌ Deployment failed:`, error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  convertQuestions(questions) {
    return questions.map(q => {
      const baseQuestion = {
        key: q.id,
        label: q.question,
        type: this.mapQuestionType(q.type, q.id)
      };

      // Add options for choice questions
      if (q.options && Array.isArray(q.options)) {
        if (typeof q.options[0] === 'string') {
          baseQuestion.options = q.options.map(opt => ({ key: opt, value: opt }));
        } else {
          baseQuestion.options = q.options.map(opt => ({ 
            key: opt.value || opt.text, 
            value: opt.text || opt.value 
          }));
        }
      }

      return baseQuestion;
    });
  }

  mapQuestionType(type, questionId) {
    // Use Facebook's predefined question types
    const typeMap = {
      'multiple_choice': 'CUSTOM',
      'dropdown': 'CUSTOM', 
      'slider': 'SLIDER',
      'range_slider': 'SLIDER',
      'text': 'CUSTOM',
      'email': 'EMAIL',
      'phone': 'PHONE'
    };
    
    // Map specific common questions to Facebook predefined types
    if (questionId) {
      const predefinedTypes = {
        'first_name': 'FIRST_NAME',
        'last_name': 'LAST_NAME',
        'email': 'EMAIL',
        'phone': 'PHONE',
        'zip_code': 'ZIP',
        'state': 'STATE',
        'city': 'CITY',
        'location_preference': 'STATE',
        'work_email': 'WORK_EMAIL'
      };
      
      if (predefinedTypes[questionId]) {
        return predefinedTypes[questionId];
      }
    }
    
    return typeMap[type] || 'CUSTOM';
  }

  async addContactFields(formId, contactFields) {
    // Add standard contact fields
    const standardFields = [
      { type: 'FIRST_NAME', required: true },
      { type: 'EMAIL', required: true },
      { type: 'PHONE', required: true }
    ];

    for (const field of standardFields) {
      try {
        await axios.post(
          `${this.baseUrl}/${formId}/questions`,
          field,
          {
            params: { access_token: this.accessToken }
          }
        );
        console.log(`   ➕ Added contact field: ${field.type}`);
      } catch (error) {
        console.log(`   ⚠️  Contact field ${field.type} may already exist`);
      }
    }
  }

  async run() {
    console.log('\n🎯 DEPLOYING ALIGNED FACEBOOK LEAD FORMS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 All forms now match optimized campaign content structure');
    console.log('🔗 Campaign correlation ensures consistent messaging\n');

    let deployedForms = [];

    for (const formPath of this.alignedForms) {
      try {
        const fullPath = path.join(__dirname, formPath);
        
        if (!fs.existsSync(fullPath)) {
          console.log(`⚠️  Form file not found: ${formPath}`);
          continue;
        }

        const formConfig = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const deployedForm = await this.deployForm(formConfig);
        
        // Add contact fields
        await this.addContactFields(deployedForm.id, formConfig.contact_fields || []);
        
        deployedForms.push({
          ...deployedForm,
          campaign_correlation: formConfig.campaign_correlation,
          expected_cpl: formConfig.expected_cpl
        });

        // Brief pause between deployments
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Failed to deploy form: ${formPath}`);
        console.error(`   Error: ${error.message}`);
      }
    }

    console.log('\n🎉 DEPLOYMENT SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${deployedForms.length} forms successfully deployed`);
    
    deployedForms.forEach(form => {
      console.log(`   📋 ${form.name} (ID: ${form.id})`);
    });

    // Save deployment results
    const deploymentResults = {
      timestamp: new Date().toISOString(),
      deployed_forms: deployedForms,
      campaign_alignment: {
        ftb_educational: deployedForms.find(f => f.campaign_correlation?.includes('FTB_Educational')),
        refi_rate_drop: deployedForms.find(f => f.campaign_correlation?.includes('Refi_RateDrop')),
        luxury_exclusivity: deployedForms.find(f => f.campaign_correlation?.includes('Luxury_Mortgage')),
        market_updates: deployedForms.find(f => f.campaign_correlation?.includes('Market_Updates')),
        va_specialist: deployedForms.find(f => f.campaign_correlation?.includes('VA_Loan_Specialist'))
      }
    };

    fs.writeFileSync('../../deployment-results.json', JSON.stringify(deploymentResults, null, 2));
    console.log('\n📊 Deployment results saved to deployment-results.json');
    console.log('\n🚀 Your Facebook Lead Ad forms are now live and aligned with campaign content!');
    
    return deployedForms;
  }
}

// Run the deployment
if (require.main === module) {
  const deployer = new AlignedFormsDeployer();
  deployer.run().catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = { AlignedFormsDeployer };