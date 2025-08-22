#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Post-build script to enhance the generated HTML with better SEO and social meta tags
 */
function enhanceHTML() {
  const distPath = path.join(__dirname, '..', 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist folder. Run build first.');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Enhanced meta tags for better SEO
  const enhancedMeta = `
    <!-- Enhanced SEO Meta Tags -->
    <meta name="description" content="Harman Preet Singh - Software Engineer & Data Scientist. Specializing in AI/ML, full-stack development, and data-driven solutions. Portfolio showcasing innovative projects and technical expertise.">
    <meta name="keywords" content="Harman Preet Singh, Software Engineer, Data Scientist, AI, Machine Learning, Full Stack Developer, Portfolio, React, Python, JavaScript">
    <meta name="author" content="Harman Preet Singh">
    <meta name="robots" content="index, follow">
    <meta name="language" content="en">
    <meta name="revisit-after" content="7 days">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://harmanpreetsingh.dev/">
    <meta property="og:title" content="Harman Preet Singh - Software Engineer & Data Scientist">
    <meta property="og:description" content="Innovative Software Engineer & Data Scientist specializing in AI/ML solutions and full-stack development. Explore my portfolio of cutting-edge projects.">
    <meta property="og:image" content="https://harmanpreetsingh.dev/og-image.jpg">
    <meta property="og:site_name" content="Harman Preet Singh Portfolio">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://harmanpreetsingh.dev/">
    <meta property="twitter:title" content="Harman Preet Singh - Software Engineer & Data Scientist">
    <meta property="twitter:description" content="Innovative Software Engineer & Data Scientist specializing in AI/ML solutions and full-stack development.">
    <meta property="twitter:image" content="https://harmanpreetsingh.dev/og-image.jpg">
    
    <!-- Additional SEO -->
    <link rel="canonical" href="https://harmanpreetsingh.dev/">
    <meta name="theme-color" content="#0f172a">
    
    <!-- Structured Data for Rich Snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Harman Preet Singh",
      "jobTitle": ["Software Engineer", "Data Scientist"],
      "description": "Innovative Software Engineer & Data Scientist specializing in AI/ML solutions and full-stack development",
      "url": "https://harmanpreetsingh.dev",
      "sameAs": [
        "https://linkedin.com/in/harmanpreetsingh",
        "https://github.com/harmanpreetsingh"
      ],
      "knowsAbout": [
        "Software Engineering",
        "Data Science", 
        "Machine Learning",
        "Artificial Intelligence",
        "Full Stack Development",
        "React",
        "Python",
        "JavaScript"
      ]
    }
    </script>`;
  
  // Insert enhanced meta tags after the existing meta viewport tag
  html = html.replace(
    /<meta name="viewport"[^>]*>/,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">${enhancedMeta}`
  );
  
  // Add manifest fallback script to prevent SSG manifest loading issues
  const manifestFallbackScript = `
    <script>
      // Fallback for SSG manifest loading issues
      (function() {
        'use strict';
        
        // Intercept fetch requests for manifest files
        if (window.fetch) {
          const originalFetch = window.fetch;
          window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;
            
            // Check if this is a manifest request with undefined in the name
            if (url && url.includes('static-loader-data-manifest-undefined.json')) {
              console.warn('Intercepted undefined manifest request:', url);
              
              // Return empty response to prevent crash
              return Promise.resolve(new Response('{}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            }
            
            return originalFetch.call(this, input, init);
          };
        }
        
        // Handle script loading errors for manifest files
        window.addEventListener('error', function(event) {
          if (event.filename && event.filename.includes('static-loader-data-manifest-undefined')) {
            console.warn('Prevented manifest loading error:', event.filename);
            event.preventDefault();
            return false;
          }
        }, true);
        
      })();
    </script>`;
  
  // Insert the script before the closing head tag
  html = html.replace('</head>', `${manifestFallbackScript}\n</head>`);
  
  // Add fallback content for better SEO (for when JavaScript is disabled)
  const fallbackContent = `
    <noscript>
      <div style="padding: 2rem; text-align: center; font-family: system-ui;">
        <h1>Harman Preet Singh</h1>
        <h2>Software Engineer & Data Scientist</h2>
        <p>Welcome to my portfolio. This site requires JavaScript to display the full experience.</p>
        <p>I specialize in AI/ML solutions, full-stack development, and data-driven applications.</p>
        <p>Contact: <a href="mailto:contact@harmanpreetsingh.dev">contact@harmanpreetsingh.dev</a></p>
      </div>
    </noscript>`;
  
  // Insert noscript content after body tag
  html = html.replace('<body>', `<body>${fallbackContent}`);
  
  // Write the enhanced HTML back
  fs.writeFileSync(indexPath, html, 'utf8');
  
  console.log('✅ Enhanced index.html with SEO meta tags, structured data, and manifest fallback');
}

/**
 * Generate additional static files for better SEO
 */
function generateStaticFiles() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Generate robots.txt if it doesn't exist
  const robotsPath = path.join(distPath, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://harmanpreetsingh.dev/sitemap.xml`;
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ Generated robots.txt');
  }
  
  // Generate a basic sitemap.xml
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://harmanpreetsingh.dev/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://harmanpreetsingh.dev/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log('✅ Generated sitemap.xml');
}

// Run the enhancement
console.log('🚀 Enhancing build for production...');
enhanceHTML();
generateStaticFiles();
console.log('✨ Build enhancement complete!');
