#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate dynamic sitemap including blog posts
 */
function generateSitemap() {
  console.log('🗺️ Generating sitemap...');
  
  const baseUrl = 'https://harmanpunn.me';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Static pages
  const staticPages = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    }
  ];
  
  // Dynamic blog pages
  let blogPages = [];
  
  try {
    const postsPath = path.join(__dirname, '..', 'public', 'static-data', 'posts.json');
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
      
      blogPages = posts
        .filter(post => post.status === 'Published' && post.isPublic)
        .map(post => ({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.last_edited_time ? new Date(post.last_edited_time).toISOString().split('T')[0] : currentDate,
          changefreq: 'monthly',
          priority: '0.8'
        }));
      
      console.log(`📝 Found ${blogPages.length} published blog posts for sitemap`);
    } else {
      console.warn('⚠️ Posts data not found, generating sitemap with static pages only');
    }
  } catch (error) {
    console.error('❌ Error loading blog posts for sitemap:', error.message);
  }
  
  // Combine all pages
  const allPages = [...staticPages, ...blogPages];
  
  // Generate XML sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to both public and dist directories
  const publicSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  const distSitemapPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
  
  try {
    // Update public sitemap (for development)
    fs.writeFileSync(publicSitemapPath, xmlContent);
    console.log(`✅ Updated public sitemap: ${allPages.length} URLs`);
    
    // Update dist sitemap (for production)
    if (fs.existsSync(path.dirname(distSitemapPath))) {
      fs.writeFileSync(distSitemapPath, xmlContent);
      console.log(`✅ Updated dist sitemap: ${allPages.length} URLs`);
    }
    
    // Log the URLs for verification
    console.log('📄 Sitemap URLs:');
    allPages.forEach(page => {
      console.log(`  • ${page.loc}`);
    });
    
  } catch (error) {
    console.error('❌ Error writing sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap };