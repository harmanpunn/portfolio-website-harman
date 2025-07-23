import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasNotionToken = !!process.env.NOTION_TOKEN;
  const hasNotionDbId = !!process.env.NOTION_DATABASE_ID;
  
  return res.status(200).json({
    message: 'API Test Endpoint',
    environment: process.env.NODE_ENV || 'development',
    hasNotionToken,
    hasNotionDbId,
    notionTokenLength: process.env.NOTION_TOKEN?.length || 0,
    notionDbIdLength: process.env.NOTION_DATABASE_ID?.length || 0,
    timestamp: new Date().toISOString()
  });
} 