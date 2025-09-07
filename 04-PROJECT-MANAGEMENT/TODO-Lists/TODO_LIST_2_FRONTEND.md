# TODO List 2: Frontend Team (Performance Optimization)
## 🎯 TARGET: Lighthouse Score 90+ | Complete within 48-72 hours

### 🎨 1. Critical CSS & Loading Performance

#### 1.1 Extract Critical CSS
- [ ] Install and configure Critters:
  ```bash
  cd Website
  npm install --save-dev critters
  ```

- [ ] Update `vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite';
  import critters from 'critters';
  
  export default defineConfig({
    plugins: [
      // ... other plugins
      critters({
        preload: 'swap',
        includeSelectors: ['.hero-section', '.above-fold'],
        inlineFonts: true
      })
    ]
  });
  ```

#### 1.2 Optimize Font Loading
- [ ] Update font imports in `/Website/index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
  ```

#### 1.3 Add Resource Hints
- [ ] Add to document head:
  ```html
  <!-- DNS Prefetch for external resources -->
  <link rel="dns-prefetch" href="//images.unsplash.com">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  
  <!-- Preconnect for critical resources -->
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin>
  
  <!-- Preload critical assets -->
  <link rel="preload" href="/assets/images/heroes/hero-modern-home.webp" as="image" type="image/webp">
  ```

### 🖼️ 2. Advanced Image Optimization

#### 2.1 Create Progressive Image Component
Create `/Website/src/components/common/ProgressiveImage.tsx`:
```typescript
import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  webpSrc?: string;
  placeholder: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  webpSrc,
  placeholder,
  alt,
  className = '',
  loading = 'lazy'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement>();

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && loading === 'lazy') {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      observer.observe(imageRef);
    } else {
      setImageSrc(src);
    }

    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef!);
      }
    };
  }, [imageRef, src, loading]);

  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        ref={setImageRef as any}
        src={imageSrc}
        alt={alt}
        className={`${className} ${imageSrc === placeholder ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        loading={loading}
      />
    </picture>
  );
};

export default ProgressiveImage;
```

#### 2.2 Generate Placeholder Images
Create `/Website/scripts/generate-placeholders.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generatePlaceholder(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(20) // Very small
    .blur(5)
    .toFile(outputPath);
}

// Generate placeholders for all images
async function generateAllPlaceholders() {
  const imagesDir = path.join(__dirname, '../public/assets/images');
  // Implementation...
}
```

#### 2.3 Replace All Image Components
- [ ] Update homepage hero:
  ```tsx
  <ProgressiveImage
    src="/assets/images/heroes/hero-modern-home.jpg"
    webpSrc="/assets/images/heroes/hero-modern-home.webp"
    placeholder="/assets/images/heroes/hero-modern-home-placeholder.jpg"
    alt="Modern Texas home"
    className="w-full h-full object-cover"
    loading="eager" // Hero images load immediately
  />
  ```

### ⚡ 3. React Performance Optimization

#### 3.1 Implement Component Memoization
- [ ] Wrap expensive components with React.memo:
  ```typescript
  // TexasMarketShowcase.tsx
  export default React.memo(TexasMarketShowcase, (prevProps, nextProps) => {
    return prevProps.selectedMarket?.id === nextProps.selectedMarket?.id;
  });
  ```

#### 3.2 Optimize Re-renders
- [ ] Add useMemo for expensive calculations:
  ```typescript
  const expensiveCalculation = useMemo(() => {
    return calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
  }, [loanAmount, interestRate, loanTerm]);
  ```

#### 3.3 Implement Virtual Scrolling
- [ ] For long lists, use react-window:
  ```bash
  npm install react-window
  ```
  ```typescript
  import { FixedSizeList } from 'react-window';
  
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={80}
    width="100%"
  >
    {Row}
  </FixedSizeList>
  ```

### 🚀 4. Loading State Optimization

#### 4.1 Create Skeleton Components
Create `/Website/src/components/common/Skeletons.tsx`:
```typescript
export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-2">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded" style={{
        width: `${Math.random() * 40 + 60}%`
      }}></div>
    ))}
  </div>
);
```

#### 4.2 Implement Loading States
- [ ] Add loading states to all async components:
  ```typescript
  const [isLoading, setIsLoading] = useState(true);
  
  return isLoading ? <CardSkeleton /> : <ActualContent />;
  ```

### 📊 5. Performance Monitoring Setup

#### 5.1 Implement Web Vitals Tracking
Create `/Website/src/utils/webVitals.ts`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}

// In main.tsx
reportWebVitals((metric) => {
  // Send to analytics
  console.log(metric);
  
  // Send to Application Insights
  if (window.appInsights) {
    window.appInsights.trackMetric({
      name: metric.name,
      average: metric.value,
      sampleCount: 1
    });
  }
});
```

#### 5.2 Add Performance Marks
- [ ] Add performance marks to critical user flows:
  ```typescript
  // Start of application
  performance.mark('app-init-start');
  
  // After first render
  performance.mark('app-init-end');
  performance.measure('app-initialization', 'app-init-start', 'app-init-end');
  ```

### ✅ 6. Performance Checklist

#### 6.1 Core Web Vitals Targets
- [ ] LCP < 2.5s (Largest Contentful Paint)
- [ ] FID < 100ms (First Input Delay)
- [ ] CLS < 0.1 (Cumulative Layout Shift)
- [ ] FCP < 1.8s (First Contentful Paint)
- [ ] TTI < 3.8s (Time to Interactive)

#### 6.2 Bundle Size Targets
- [ ] Initial JS bundle < 200KB (gzipped)
- [ ] Initial CSS < 50KB (gzipped)
- [ ] Largest route chunk < 150KB
- [ ] Total bundle < 500KB

#### 6.3 Image Optimization Targets
- [ ] Hero images < 200KB
- [ ] Card images < 100KB
- [ ] All images have WebP variants
- [ ] All images have blur-up placeholders

### 🧪 7. Testing & Validation

#### 7.1 Lighthouse CI Setup
```bash
npm install --save-dev @lhci/cli
npx lhci autorun
```

#### 7.2 Performance Budget
Create `.lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }]
      }
    }
  }
};
```

### 📈 Success Metrics
- [ ] Lighthouse Performance Score > 90
- [ ] All images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] No render-blocking resources
- [ ] Efficient cache policy implemented

### 🔥 Hot Tips
1. Test on throttled 3G connection
2. Use Chrome DevTools Coverage tab to find unused CSS/JS
3. Monitor real user metrics with RUM
4. Set up performance budgets in CI/CD

---

**Deadline: [Date + 72 hours]**
**Daily Standup: 10 AM in #frontend-performance**
**Lighthouse Target: 90+ or bust! 🚀**