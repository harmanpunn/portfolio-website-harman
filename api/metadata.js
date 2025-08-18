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

// Format post metadata only (for caching checks)
function formatPostMetadata(page) {
  const properties = page.properties;
  
  // Helper function to get property value safely
  const getPropertyValue = (propName, type) => {
    const prop = properties[propName];
    if (!prop) return null;
    
    switch (type) {
      case 'title':
        return getPlainText(prop.title || []);
      case 'select':
        return prop.select?.name || '';
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
  const status = getPropertyValue('Status', 'select') || 'Draft';
  const isPublic = getPropertyValue('Public', 'checkbox');
  
  return {
    id: page.id,
    slug,
    title,
    status,
    isPublic,
    last_edited_time: page.last_edited_time
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Force cache headers for metadata (shorter cache time)
  res.setHeader('Cache-Control', 'public, s-maxage=60, max-age=60, stale-while-revalidate=120');
  res.setHeader('CDN-Cache-Control', 's-maxage=60');
  res.setHeader('Vercel-CDN-Cache-Control', 's-maxage=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if environment variables are set
  if (!process.env.NOTION_TOKEN) {
    console.error('NOTION_TOKEN environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: NOTION_TOKEN not found'
    });
  }

  if (!process.env.NOTION_DATABASE_ID) {
    console.error('NOTION_DATABASE_ID environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: NOTION_DATABASE_ID not found'
    });
  }

  try {
    await initializeNotion();
    
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const databaseId = process.env.NOTION_DATABASE_ID;
    const { slug } = req.query;

    if (slug) {
      // Get metadata for specific post
      console.log('Fetching metadata for slug:', slug);
      
      const response = await notion.databases.query({
        database_id: databaseId
      });

      const allPosts = response.results.map(page => formatPostMetadata(page));
      
      // Filter for published and public posts, then find by slug
      const publishedPosts = allPosts.filter(post => 
        post.status === 'Published' && post.isPublic === true
      );
      
      const post = publishedPosts.find(p => p.slug === slug);
      
      if (!post) {
        console.log('No published post found with slug:', slug);
        return res.status(404).json({ error: 'Post not found' });
      }

      console.log('Successfully fetched metadata for:', post.title);
      return res.status(200).json({
        id: post.id,
        slug: post.slug,
        last_edited_time: post.last_edited_time
      });
    } else {
      // Get metadata for all posts
      console.log('Fetching metadata for all posts');
      
      const response = await notion.databases.query({
        database_id: databaseId
      });

      console.log('Found', response.results.length, 'posts');

      const allPosts = response.results.map(page => formatPostMetadata(page));

      // Filter for published and public posts
      const publishedPosts = allPosts.filter(post => 
        post.status === 'Published' && post.isPublic === true
      );

      const metadata = publishedPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        last_edited_time: post.last_edited_time
      }));

      console.log('Successfully processed metadata for', metadata.length, 'published posts');
      return res.status(200).json(metadata);
    }
  } catch (error) {
    console.error('Notion API error:', error);
    
    // Return more specific error information
    if (error.code === 'unauthorized') {
      return res.status(401).json({ 
        error: 'Notion API authentication failed'
      });
    }
    
    if (error.code === 'object_not_found') {
      return res.status(404).json({ 
        error: 'Notion database not found'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch metadata from Notion',
      details: error.message || 'Unknown error occurred'
    });
  }
}
