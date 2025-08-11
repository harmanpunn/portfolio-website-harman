#!/usr/bin/env node

// Build-time content fetcher for SSG
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: '.env.local' });

// Configuration
const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || process.env.VITE_NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.log('⚠️ Notion credentials not found. Creating fallback static content...');
  
  // Create fallback content for development
  const fallbackPosts = [
    {
      id: 'sample-1',
      title: 'Getting Started with AI',
      slug: 'getting-started-with-ai',
      excerpt: 'An introduction to artificial intelligence and its applications in modern development.',
      publishedDate: '2024-01-15',
      content: '<h1>Getting Started with AI</h1><p>This is a sample blog post...</p>',
      tags: ['AI', 'Machine Learning'],
      lastEditedTime: new Date().toISOString()
    },
    {
      id: 'sample-2', 
      title: 'Building Modern Web Applications',
      slug: 'building-modern-web-applications',
      excerpt: 'Learn how to build scalable and performant web applications using modern technologies.',
      publishedDate: '2024-01-20',
      content: '<h1>Building Modern Web Applications</h1><p>This is another sample blog post...</p>',
      tags: ['Web Development', 'React'],
      lastEditedTime: new Date().toISOString()
    }
  ];

  // Ensure output directory exists
  const outputDir = `${__dirname}/../src/data`;
  mkdirSync(outputDir, { recursive: true });
  
  // Write fallback data
  writeFileSync(`${outputDir}/posts.json`, JSON.stringify(fallbackPosts, null, 2));
  writeFileSync(`${outputDir}/posts-metadata.json`, JSON.stringify(
    fallbackPosts.map(({ id, title, slug, excerpt, publishedDate, lastEditedTime, tags }) => 
      ({ id, title, slug, excerpt, publishedDate, lastEditedTime, tags })
    ), null, 2
  ));
  
  console.log('✅ Created fallback static content for development');
  process.exit(0);
}

// Dynamic import for Notion client
let Client;

async function initializeNotion() {
  if (!Client) {
    const notionModule = await import('@notionhq/client');
    Client = notionModule.Client;
  }
}

// Helper functions (copied from your API)
function getPlainText(richText) {
  return richText?.map(t => t.plain_text).join('') || '';
}

function richTextToMarkdown(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(textObj => {
    let text = textObj.plain_text || '';
    const annotations = textObj.annotations || {};
    
    if (annotations.bold) text = `**${text}**`;
    if (annotations.italic) text = `*${text}*`;
    if (annotations.code) text = `\`${text}\``;
    if (annotations.strikethrough) text = `~~${text}~~`;
    if (annotations.underline) text = `<u>${text}</u>`;
    
    if (textObj.href) text = `[${text}](${textObj.href})`;
    
    return text;
  }).join('');
}

function blockToMarkdown(block, depth = 0) {
  const { type } = block;
  const indent = '  '.repeat(depth);
  
  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(block.paragraph.rich_text) + '\n\n';
    case 'heading_1':
      return `# ${richTextToMarkdown(block.heading_1.rich_text)}\n\n`;
    case 'heading_2':
      return `## ${richTextToMarkdown(block.heading_2.rich_text)}\n\n`;
    case 'heading_3':
      return `### ${richTextToMarkdown(block.heading_3.rich_text)}\n\n`;
    case 'bulleted_list_item':
      return `${indent}- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}\n`;
    case 'numbered_list_item':
      if (depth > 0) {
        return `${indent}- ${richTextToMarkdown(block.numbered_list_item.rich_text)}\n`;
      }
      return `${indent}1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}\n`;
    case 'code':
      const language = block.code.language || '';
      const code = getPlainText(block.code.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    case 'quote':
      return `> ${richTextToMarkdown(block.quote.rich_text)}\n\n`;
    case 'divider':
      return '---\n\n';
    case 'image':
      const imageUrl = block.image.external?.url || block.image.file?.url;
      const caption = richTextToMarkdown(block.image.caption || []);
      return `![${caption}](${imageUrl})\n\n`;
    default:
      return '';
  }
}

async function getPageContent(notion, pageId) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  let content = '';
  for (const block of response.results) {
    content += await blockToMarkdownWithChildren(notion, block);
  }

  return content;
}

async function blockToMarkdownWithChildren(notion, block, depth = 0) {
  let content = blockToMarkdown(block, depth);
  
  if (block.has_children) {
    try {
      const childrenResponse = await notion.blocks.children.list({
        block_id: block.id,
        page_size: 100,
      });
      
      for (const childBlock of childrenResponse.results) {
        content += await blockToMarkdownWithChildren(notion, childBlock, depth + 1);
      }
    } catch (error) {
      console.error('Error fetching child blocks:', error);
    }
  }
  
  return content;
}

function formatPost(page, content) {
  const properties = page.properties;
  
  const getPropertyValue = (propName, type) => {
    const prop = properties[propName];
    if (!prop) return null;
    
    switch (type) {
      case 'title':
        return getPlainText(prop.title || []);
      case 'rich_text':
        return getPlainText(prop.rich_text || []);
      case 'select':
        return prop.select?.name || '';
      case 'multi_select':
        return prop.multi_select?.map(item => item.name) || [];
      case 'date':
        return prop.date?.start || '';
      case 'checkbox':
        return prop.checkbox || false;
      default:
        return '';
    }
  };
  
  const title = getPropertyValue('Title', 'title') || 'Untitled';
  const slug = title.toLowerCase()
                   .replace(/[^a-z0-9\s-]/g, '')
                   .replace(/\s+/g, '-')
                   .trim() || page.id;
                   
  const excerpt = getPropertyValue('Description', 'rich_text') || 
                  content.substring(0, 200) + '...';
                  
  const publishedDate = getPropertyValue('Publish Date', 'date') || 
                       new Date().toISOString();
                       
  const tags = getPropertyValue('Categories', 'multi_select') || [];
  const status = getPropertyValue('Status', 'select') || 'Draft';
  const isPublic = getPropertyValue('Public', 'checkbox');
  
  return {
    id: page.id,
    title,
    slug,
    excerpt,
    content,
    publishedDate,
    tags,
    status,
    isPublic,
    coverImage: '',
    last_edited_time: page.last_edited_time
  };
}

async function fetchAllPosts() {
  console.log('🚀 Starting build-time content fetch...');
  
  try {
    await initializeNotion();
    const notion = new Client({ auth: NOTION_TOKEN });

    console.log('📡 Querying Notion database...');
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID
    });

    console.log(`📄 Found ${response.results.length} posts`);

    const allPosts = await Promise.all(
      response.results.map(async (page) => {
        console.log(`⏳ Processing: ${page.properties.Title?.title?.[0]?.plain_text || 'Untitled'}`);
        const content = await getPageContent(notion, page.id);
        return formatPost(page, content);
      })
    );

    // Filter for published and public posts
    const publishedPosts = allPosts.filter(post => 
      post.status === 'Published' && post.isPublic === true
    );

    console.log(`✅ Processed ${publishedPosts.length} published posts`);

    // Create static data directory
    const staticDir = './public/static-data';
    mkdirSync(staticDir, { recursive: true });

    // Write posts data
    writeFileSync(
      `${staticDir}/posts.json`,
      JSON.stringify(publishedPosts, null, 2)
    );

    // Write individual post files
    publishedPosts.forEach(post => {
      writeFileSync(
        `${staticDir}/post-${post.slug}.json`,
        JSON.stringify(post, null, 2)
      );
    });

    // Write metadata for client-side caching
    const metadata = publishedPosts.map(post => ({
      id: post.id,
      slug: post.slug,
      last_edited_time: post.last_edited_time
    }));

    writeFileSync(
      `${staticDir}/metadata.json`,
      JSON.stringify(metadata, null, 2)
    );

    console.log('🎉 Build-time content fetch completed!');
    console.log(`📁 Generated files in ${staticDir}/`);
    
    return publishedPosts;
  } catch (error) {
    console.error('❌ Build-time fetch failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAllPosts();
}

export { fetchAllPosts };
