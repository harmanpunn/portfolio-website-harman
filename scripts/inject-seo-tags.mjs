#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

/**
 * Inject proper SEO meta tags into generated HTML files
 */
async function injectSEOTags() {
  console.log('🔧 Starting SEO tag injection...');
  
  try {
    // Load blog post data
    const postsPath = path.join(__dirname, '../public/static-data/posts.json');
    const posts = JSON.parse(await fs.readFile(postsPath, 'utf-8'));
    
    // Process each blog post HTML file
    for (const post of posts) {
      const htmlPath = path.join(distDir, 'blog', post.slug, 'index.html');
      
      try {
        let html = await fs.readFile(htmlPath, 'utf-8');
        
        // Generate blog post specific SEO tags
        const blogTitle = `${post.title} | Harmanpreet Singh`;
        const blogDescription = post.excerpt;
        const blogUrl = `https://harmanpunn.me/blog/${post.slug}`;
        const blogImage = post.coverImage || "https://harmanpunn.me/og-image.jpg";
        
        // Generate article-specific JSON-LD
        const articleJsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Person",
            "@id": "https://harmanpunn.me/#person",
            "name": "Harmanpreet Singh",
            "url": "https://harmanpunn.me"
          },
          "publisher": {
            "@type": "Person",
            "@id": "https://harmanpunn.me/#person"
          },
          "datePublished": post.publishedDate,
          "dateModified": post.last_edited_time,
          "url": blogUrl,
          "image": blogImage,
          "keywords": post.tags.join(', '),
          "articleSection": "Technology",
          "wordCount": Math.floor(post.content.length / 5) // Approximate word count
        };
        
        // Replace title
        html = html.replace(
          /<title>.*?<\/title>/,
          `<title>${blogTitle}</title>`
        );
        
        // Replace meta description
        html = html.replace(
          /<meta name="description" content=".*?"/,
          `<meta name="description" content="${blogDescription.replace(/"/g, '&quot;')}"`
        );
        
        // Replace Open Graph tags
        html = html.replace(
          /<meta property="og:title" content=".*?"/,
          `<meta property="og:title" content="${blogTitle.replace(/"/g, '&quot;')}"`
        );
        html = html.replace(
          /<meta property="og:description" content=".*?"/,
          `<meta property="og:description" content="${blogDescription.replace(/"/g, '&quot;')}"`
        );
        html = html.replace(
          /<meta property="og:type" content=".*?"/,
          `<meta property="og:type" content="article"`
        );
        html = html.replace(
          /<meta property="og:url" content=".*?"/,
          `<meta property="og:url" content="${blogUrl}"`
        );
        html = html.replace(
          /<meta property="og:image" content=".*?"/,
          `<meta property="og:image" content="${blogImage}"`
        );
        
        // Add article-specific Open Graph tags
        const articleMetaTags = `
    <meta property="article:published_time" content="${post.publishedDate}" />
    <meta property="article:modified_time" content="${post.last_edited_time}" />
    <meta property="article:author" content="Harmanpreet Singh" />
    <meta property="article:section" content="Technology" />
    ${post.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n    ')}`;
        
        // Insert article meta tags after existing og:image tag
        html = html.replace(
          /(<meta property="og:image"[^>]*>)/,
          `$1${articleMetaTags}`
        );
        
        // Add canonical URL
        const canonicalTag = `<link rel="canonical" href="${blogUrl}" />`;
        html = html.replace(
          /(<meta property="og:image:height"[^>]*>)/,
          `$1\n    \n    ${canonicalTag}`
        );
        
        // Update Twitter meta tags
        html = html.replace(
          /<meta name="twitter:image" content=".*?"/,
          `<meta name="twitter:image" content="${blogImage}"`
        );
        
        // Add Twitter-specific meta tags for articles
        const twitterMetaTags = `
    <meta name="twitter:title" content="${blogTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${blogDescription.replace(/"/g, '&quot;')}" />`;
        
        html = html.replace(
          /(<meta name="twitter:image"[^>]*>)/,
          `$1${twitterMetaTags}`
        );
        
        // Replace or add JSON-LD structured data for the article
        const jsonLdScript = `<script type="application/ld+json">
${JSON.stringify(articleJsonLd, null, 2)}
    </script>`;
        
        // Find and replace the existing JSON-LD script
        html = html.replace(
          /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
          jsonLdScript
        );
        
        // Write updated HTML
        await fs.writeFile(htmlPath, html, 'utf-8');
        console.log(`✅ Updated SEO tags for: ${post.title}`);
        
      } catch (error) {
        console.warn(`⚠️  Could not update SEO tags for ${post.slug}:`, error.message);
      }
    }
    
    console.log('🎉 SEO tag injection completed!');
    
  } catch (error) {
    console.error('❌ Error during SEO tag injection:', error);
    process.exit(1);
  }
}

// Run the script
injectSEOTags();