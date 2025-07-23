// Use dynamic import to avoid CommonJS/ES module conflicts
let Client;

async function initializeNotion() {
  if (!Client) {
    const notionModule = await import('@notionhq/client');
    Client = notionModule.Client;
  }
}

// Helper function to extract text from Notion rich text
function getPlainText(richText) {
  return richText?.map(t => t.plain_text).join('') || '';
}

// Removed blockToMarkdown function since we're using Body property for content

// Format post data - using Body property for content
function formatPost(page) {
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
                   
  // Get the actual body content from the Body property
  const bodyContent = getPropertyValue('Body', 'rich_text') || '';
  
  const excerpt = getPropertyValue('Description', 'rich_text') || 
                  bodyContent.substring(0, 200) + '...';
                  
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
    content: bodyContent, // Use the Body property content instead of page blocks
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
      const allPosts = response.results.map((page) => {
        return formatPost(page);
      });
      
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

      const allPosts = response.results.map((page) => {
        return formatPost(page);
      });

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