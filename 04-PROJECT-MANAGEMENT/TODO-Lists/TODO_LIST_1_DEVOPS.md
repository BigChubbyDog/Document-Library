# TODO List 1: DevOps Team (Critical Fixes)
## 🚨 BLOCKS DEPLOYMENT - Complete within 24-48 hours

### 🔧 1. TypeScript & Build Fixes

#### 1.1 Install Missing Dependencies
```bash
# Run these commands in the Website directory
cd Website
npm install @microsoft/microsoft-graph-client@3.0.7
npm install @azure/msal-browser@3.10.0
npm install --save-dev @types/microsoft-graph@2.40.0
npm install applicationinsights@2.9.5
```

#### 1.2 Fix Critical Type Errors
- [ ] Fix `/src/components/ai/SmartRateAdvisor.tsx`:
  ```typescript
  // Line 96: Change RateData to RateQuote
  // Line 98: Update selectedRate type
  // Add proper interface for RateQuote
  ```

- [ ] Fix `/src/components/ValueProposition.tsx`:
  ```typescript
  // Update Grid component to Grid2 from MUI v5
  import Grid2 from '@mui/material/Unstable_Grid2';
  ```

- [ ] Fix `/src/services/mortgage/getRates.ts`:
  ```typescript
  // Replace ApplicationInsights.setup with proper initialization
  const appInsights = new ApplicationInsights({
    config: {
      connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING
    }
  });
  ```

#### 1.3 Update tsconfig.json
```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "allowJs": true,
    "strict": false,
    "noImplicitAny": false
  }
}
```

### 📸 2. Image Optimization Emergency Fix

#### 2.1 Create Optimization Script
Create `/Website/scripts/optimize-all-images.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImage(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  // Resize if larger than 1920px wide
  if (metadata.width > 1920) {
    image.resize(1920, null, { withoutEnlargement: true });
  }
  
  // Convert to WebP with quality 80
  await image
    .webp({ quality: 80 })
    .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
  // Also create smaller JPG version
  await image
    .jpeg({ quality: 85, progressive: true })
    .toFile(outputPath);
}

// Process all images
async function processAllImages() {
  const imagesDir = path.join(__dirname, '../public/assets/images');
  // ... implementation
}

processAllImages();
```

#### 2.2 Run Image Optimization
```bash
cd Website
npm install --save-dev sharp
node scripts/optimize-all-images.js
```

#### 2.3 Update Image References
- [ ] Update all `<img>` tags to use optimized versions
- [ ] Add `loading="lazy"` to all images below fold
- [ ] Implement `<picture>` elements for WebP support

### 🔌 3. Service Worker Implementation

#### 3.1 Create Service Worker
Create `/Website/public/service-worker.js`:
```javascript
const CACHE_NAME = 'mortgage-loans-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
```

#### 3.2 Create Offline Page
Create `/Website/public/offline.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Offline - Mortgage Loans Co</title>
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>You're Offline</h1>
  <p>Please check your internet connection and try again.</p>
  <p>Call us at <a href="tel:512-820-5714">512-820-5714</a></p>
</body>
</html>
```

### 📦 4. Bundle Size Reduction

#### 4.1 Implement Code Splitting
Update `/Website/src/App.tsx`:
```typescript
// Add webpackChunkName comments to all lazy imports
const HomePage = lazy(() => 
  import(/* webpackChunkName: "home" */ './pages/HomePage')
);
```

#### 4.2 Configure Vite for Better Chunking
Update `/Website/vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'utils': ['lodash', 'axios', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

#### 4.3 Remove Unused Dependencies
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Remove unused packages
npm uninstall [unused-package-names]
```

### ✅ 5. Verification Steps

#### 5.1 Build Test
```bash
cd Website
npm run build
# Should complete without errors
```

#### 5.2 Lighthouse Test
```bash
npm run build
npm run preview
# Open http://localhost:4173 in Chrome
# Run Lighthouse audit
# Target: Performance > 70 after these fixes
```

#### 5.3 Image Size Check
```bash
# No image should be larger than 500KB
find public/assets/images -type f -size +500k -exec ls -lh {} \;
```

### 🚨 Critical Success Metrics
- [ ] Build completes without errors
- [ ] All images < 500KB
- [ ] Service worker registers successfully
- [ ] Main bundle < 300KB
- [ ] TypeScript errors < 50 (from 400+)

### 📞 Escalation
If blocked on any item, immediately contact:
- Tech Lead: [Name]
- Backup: 512-820-5714

---

**Deadline: [Date + 48 hours]**
**Status Updates: Every 4 hours in #devops-critical channel**