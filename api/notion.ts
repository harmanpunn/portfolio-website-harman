import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// Helper function to extract text from Notion rich text
function getPlainText(richText: any[]): string {
  return richText?.map(t => t.plain_text).join('') || '';
}

// Helper function to convert Notion blocks to markdown
function blockToMarkdown(block: any): string {
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
async function getPageContent(pageId: string): Promise<string> {
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
function formatPost(page: any, content: string) {
  const properties = page.properties;
  
  return {
    id: page.id,
    title: getPlainText(properties.Title?.title || properties.Name?.title || []),
    slug: getPlainText(properties.Slug?.rich_text || []) || page.id,
    excerpt: getPlainText(properties.Excerpt?.rich_text || []) || content.substring(0, 200) + '...',
    content,
    publishedDate: properties['Published Date']?.date?.start || properties['Published']?.date?.start || new Date().toISOString(),
    tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
    status: properties.Status?.select?.name || 'Published',
    coverImage: properties['Cover Image']?.files?.[0]?.external?.url || properties['Cover Image']?.files?.[0]?.file?.url || ''
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { slug } = req.query;

    if (slug && typeof slug === 'string') {
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
        return res.status(404).json({ error: 'Post not found' });
      }

      const page = response.results[0];
      const content = await getPageContent(page.id);
      const post = formatPost(page, content);

      return res.status(200).json(post);
    } else {
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

      const posts = await Promise.all(
        response.results.map(async (page: any) => {
          const content = await getPageContent(page.id);
          return formatPost(page, content);
        })
      );

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.error('Notion API error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Notion' });
  }
} 