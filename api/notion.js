// Use dynamic import to avoid CommonJS/ES module conflicts
let Client;

async function initializeNotion() {
  if (!Client) {
    const notionModule = await import('@notionhq/client');
    Client = notionModule.Client;
  }
}

// Helper function to extract text from Notion rich text with formatting
function getPlainText(richText) {
  return richText?.map(t => t.plain_text).join('') || '';
}

// Helper function to convert rich text with annotations to Markdown
function richTextToMarkdown(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(textObj => {
    let text = textObj.plain_text || '';
    const annotations = textObj.annotations || {};
    
    // Apply formatting based on annotations
    if (annotations.bold) {
      text = `**${text}**`;
    }
    if (annotations.italic) {
      text = `*${text}*`;
    }
    if (annotations.code) {
      text = `\`${text}\``;
    }
    if (annotations.strikethrough) {
      text = `~~${text}~~`;
    }
    if (annotations.underline) {
      // Markdown doesn't have native underline, but we can use HTML
      text = `<u>${text}</u>`;
    }
    
    // Handle links
    if (textObj.href) {
      text = `[${text}](${textObj.href})`;
    }
    
    return text;
  }).join('');
}

// Convert Notion blocks to Markdown
function blockToMarkdown(block) {
  const { type } = block;
  
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
      return `- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}\n`;
    case 'numbered_list_item':
      return `1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}\n`;
    case 'code':
      const language = block.code.language || '';
      const code = getPlainText(block.code.rich_text); // Code blocks don't need rich formatting
      const languageLabel = language.charAt(0).toUpperCase() + language.slice(1) || 'Code';
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

// Get page content from blocks
async function getPageContent(notion, pageId) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  let content = '';
  for (const block of response.results) {
    content += blockToMarkdown(block);
  }

  return content;
}

// Format post data - using blocks for content
function formatPost(page, content) {
  const properties = page.properties;
  
  // Helper function to get property value safely
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
      case 'files':
        return prop.files?.[0]?.external?.url || prop.files?.[0]?.file?.url || '';
      case 'checkbox':
        return prop.checkbox || false;
      default:
        return '';
    }
  };
  
  // Use your actual database property names
  const title = getPropertyValue('Title', 'title') || 'Untitled';
  
  // Generate slug from title if not available
  const slug = title.toLowerCase()
                   .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                   .replace(/\s+/g, '-') // Replace spaces with hyphens
                   .trim() || page.id;
                   
  const excerpt = getPropertyValue('Description', 'rich_text') || 
                  content.substring(0, 200) + '...';
                  
  const publishedDate = getPropertyValue('Publish Date', 'date') || 
                       new Date().toISOString();
                       
  const tags = getPropertyValue('Categories', 'multi_select') || [];
  
  const status = getPropertyValue('Status', 'select') || 'Draft';
  
  const isPublic = getPropertyValue('Public', 'checkbox');
  
  // No cover image property in your schema
  const coverImage = '';
  
  return {
    id: page.id,
    title,
    slug,
    excerpt,
    content, // Use the blocks content
    publishedDate,
    tags,
    status,
    isPublic,
    coverImage
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if environment variables are set
  if (!process.env.NOTION_TOKEN) {
    console.error('NOTION_TOKEN environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: NOTION_TOKEN not found',
      details: 'Please check environment variables in Vercel dashboard'
    });
  }

  if (!process.env.NOTION_DATABASE_ID) {
    console.error('NOTION_DATABASE_ID environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: NOTION_DATABASE_ID not found',
      details: 'Please check environment variables in Vercel dashboard'
    });
  }

  try {
    // Initialize Notion client
    await initializeNotion();
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    const databaseId = process.env.NOTION_DATABASE_ID;

    console.log('Notion client initialized successfully');

    const { slug } = req.query;

    if (slug && typeof slug === 'string') {
      console.log('Fetching single post with slug:', slug);
      
      // Get a single post by slug - simplified query
      const response = await notion.databases.query({
        database_id: databaseId
        // We'll search through all posts and find by slug in the results
      });

      // Find the post with matching slug
      const allPosts = await Promise.all(
        response.results.map(async (page) => {
          const content = await getPageContent(notion, page.id);
          return formatPost(page, content);
        })
      );
      
      // Filter for published and public posts, then find by slug
      const publishedPosts = allPosts.filter(post => 
        post.status === 'Published' && post.isPublic === true
      );
      
      const post = publishedPosts.find(p => p.slug === slug);
      
      if (!post) {
        console.log('No published post found with slug:', slug);
        return res.status(404).json({ error: 'Post not found' });
      }

      console.log('Successfully fetched post:', post.title);
      return res.status(200).json(post);
    } else {
      console.log('Fetching all posts');
      
      // Get all posts - remove filters for now to see what we get
      const response = await notion.databases.query({
        database_id: databaseId
        // Remove filters and sorting for now - we'll handle filtering on the client side
      });

      console.log('Found', response.results.length, 'posts');

      const allPosts = await Promise.all(
        response.results.map(async (page) => {
          const content = await getPageContent(notion, page.id);
          return formatPost(page, content);
        })
      );

      // Filter for published and public posts
      const publishedPosts = allPosts.filter(post => 
        post.status === 'Published' && post.isPublic === true
      );

      console.log('Successfully processed', publishedPosts.length, 'published posts');
      return res.status(200).json(publishedPosts);
    }
  } catch (error) {
    console.error('Notion API error:', error);
    
    // Return more specific error information
    if (error.code === 'unauthorized') {
      return res.status(401).json({ 
        error: 'Notion API authentication failed',
        details: 'Check if your NOTION_TOKEN is valid and has access to the database'
      });
    }
    
    if (error.code === 'object_not_found') {
      return res.status(404).json({ 
        error: 'Notion database not found',
        details: 'Check if your NOTION_DATABASE_ID is correct and the database is shared with your integration'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch from Notion',
      details: error.message || 'Unknown error occurred',
      stack: error.stack
    });
  }
}