/**
 * PM2 Ecosystem Configuration for Production Webhook Server
 * Provides process management, clustering, and monitoring
 */

module.exports = {
  apps: [
    {
      name: 'mortgage-webhook-server',
      script: './production-webhook-server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001
      },
      
      // Performance & Monitoring
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Logging
      log_file: './logs/webhook-server.log',
      error_file: './logs/webhook-server-error.log',
      out_file: './logs/webhook-server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart on file changes (development only)
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        'data',
        'leads',
        'tests'
      ],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check_url: 'http://localhost:3000/health',
      health_check_grace_period: 5000
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/mortgage-campaign-intelligence.git',
      path: '/var/www/mortgage-webhooks',
      'post-deploy': 'npm install && npm run test && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-repo/mortgage-campaign-intelligence.git',
      path: '/var/www/mortgage-webhooks-staging',
      'post-deploy': 'npm install && npm run test && pm2 reload ecosystem.config.js --env staging'
    }
  }
};