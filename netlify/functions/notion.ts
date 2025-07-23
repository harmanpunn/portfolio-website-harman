import { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// Helper functions (same as Vercel version)
function getPlainText(richText: any[]): string {
  return richText?.map(t => t.plain_text).join('') || '';
}

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

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { slug } = event.queryStringParameters || {};

    if (slug) {
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
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Post not found' })
        };
      }

      const page = response.results[0];
      const content = await getPageContent(page.id);
      const post = formatPost(page, content);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(post)
      };
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(posts)
      };
    }
  } catch (error) {
    console.error('Notion API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch from Notion' })
    };
  }
}; 