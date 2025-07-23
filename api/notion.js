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

// Helper function to convert Notion blocks to markdown
function blockToMarkdown(block) {
  const { type } = block;
  
  switch (type) {
    case 'paragraph':
      return getPlainText(block.paragraph.rich_text) + '\n\n';
    case 'heading_1':
      return `# ${getPlainText(block.heading_1.rich_text)}\n\n`;
    case 'heading_2':
      return `## ${getPlainText(block.heading_2.rich_text)}\n\n`;
    case 'heading_3':
      return `### ${getPlainText(block.heading_3.rich_text)}\n\n`;
    case 'bulleted_list_item':
      return `- ${getPlainText(block.bulleted_list_item.rich_text)}\n`;
    case 'numbered_list_item':
      return `1. ${getPlainText(block.numbered_list_item.rich_text)}\n`;
    case 'code':
      const language = block.code.language || '';
      const code = getPlainText(block.code.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    case 'quote':
      return `> ${getPlainText(block.quote.rich_text)}\n\n`;
    case 'divider':
      return '---\n\n';
    default:
      return '';
  }
}

// Get page content
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

// Format post data
function formatPost(page, content) {
  const properties = page.properties;
  
  return {
    id: page.id,
    title: getPlainText(properties.Title?.title || properties.Name?.title || []),
    slug: getPlainText(properties.Slug?.rich_text || []) || page.id,
    excerpt: getPlainText(properties.Excerpt?.rich_text || []) || content.substring(0, 200) + '...',
    content,
    publishedDate: properties['Published Date']?.date?.start || properties['Published']?.date?.start || new Date().toISOString(),
    tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
    status: properties.Status?.select?.name || 'Published',
    coverImage: properties['Cover Image']?.files?.[0]?.external?.url || properties['Cover Image']?.files?.[0]?.file?.url || ''
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
      
      // Get a single post by slug
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              select: {
                equals: 'Published'
              }
            },
            {
              property: 'Slug',
              rich_text: {
                equals: slug
              }
            }
          ]
        }
      });

      if (response.results.length === 0) {
        console.log('No post found with slug:', slug);
        return res.status(404).json({ error: 'Post not found' });
      }

      const page = response.results[0];
      const content = await getPageContent(notion, page.id);
      const post = formatPost(page, content);

      console.log('Successfully fetched post:', post.title);
      return res.status(200).json(post);
    } else {
      console.log('Fetching all posts');
      
      // Get all posts
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Published Date',
            direction: 'descending'
          }
        ]
      });

      console.log('Found', response.results.length, 'posts');

      const posts = await Promise.all(
        response.results.map(async (page) => {
          const content = await getPageContent(notion, page.id);
          return formatPost(page, content);
        })
      );

      console.log('Successfully processed all posts');
      return res.status(200).json(posts);
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