import { Client } from '@notionhq/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  tags: string[];
  status: string;
  coverImage?: string;
  last_edited_time?: string;
}

interface CachedPost {
  post: BlogPost;
  lastEditedTime: string;
  cachedAt: number;
}

interface PostsCache {
  posts: BlogPost[];
  lastFetch: number;
}

class NotionService {
  private apiUrl: string;
  private cache = new Map<string, CachedPost>();
  private postsCache: PostsCache | null = null;

  constructor() {
    // Use environment variable if available, otherwise determine based on current URL
    this.apiUrl = import.meta.env.VITE_API_URL || 
                  (window.location.hostname === 'localhost' 
                    ? 'http://localhost:3000/api/notion'
                    : '/api/notion');
  }

  async getPosts(): Promise<BlogPost[]> {
    console.log('📡 getPosts called, trying static data first...');
    
    // First, try to load from static data (generated at build time)
    try {
      const staticUrl = '/static-data/posts.json';
      console.log('📁 Attempting to fetch:', staticUrl);
      
      const response = await fetch(staticUrl);
      console.log('📁 Static data response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('📁 Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('📁 Static data returned non-JSON content type:', contentType);
          throw new Error('Non-JSON response from static data');
        }
        
        const posts = await response.json();
        console.log('📁 Successfully loaded posts from static data:', posts.length);
        return posts;
      } else {
        console.log('📁 Static data not available, status:', response.status);
      }
    } catch (error) {
      console.log('📡 Static data failed, error:', error);
      console.log('📡 Trying cache and API fallback...');
    }

    // Fallback to cache checking and API
    try {
      // Check if we have recent cached posts (within 30 minutes to match server cache)
      if (this.postsCache && (Date.now() - this.postsCache.lastFetch) < 30 * 60 * 1000) {
        const cacheAge = Math.round((Date.now() - this.postsCache.lastFetch) / 1000 / 60);
        console.log(`🎯 CACHE HIT: Using cached posts (${cacheAge} minutes old, ${this.postsCache.posts.length} posts)`);
        return this.postsCache.posts;
      }

      if (this.postsCache) {
        const cacheAge = Math.round((Date.now() - this.postsCache.lastFetch) / 1000 / 60);
        console.log(`⏰ CACHE EXPIRED: Cache is ${cacheAge} minutes old, fetching fresh data`);
      } else {
        console.log('🆕 FRESH REQUEST: No cache found, fetching from API');
      }

      console.log('🌐 FETCHING: Fresh posts from:', this.apiUrl);
      const startTime = performance.now();
      const response = await fetch(this.apiUrl);
      const fetchTime = Math.round(performance.now() - startTime);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API ERROR:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const posts = await response.json();
      console.log(`✅ FETCH SUCCESS: ${posts.length} posts fetched in ${fetchTime}ms`);
      
      // Update cache
      this.postsCache = { posts, lastFetch: Date.now() };
      console.log('💾 CACHE UPDATED: Posts stored in memory cache');
      
      // Update individual post cache
      posts.forEach((post: BlogPost) => {
        if (post.last_edited_time) {
          this.cache.set(post.id, {
            post,
            lastEditedTime: post.last_edited_time,
            cachedAt: Date.now()
          });
        }
      });
      console.log(`📝 INDIVIDUAL CACHE: ${posts.length} posts cached individually`);
      
      return posts;
    } catch (error) {
      console.error('💥 FETCH ERROR:', error);
      
      // Return cached posts if available
      if (this.postsCache) {
        const cacheAge = Math.round((Date.now() - this.postsCache.lastFetch) / 1000 / 60);
        console.warn(`🔄 FALLBACK: Using stale cache (${cacheAge} minutes old) due to fetch error`);
        return this.postsCache.posts;
      }
      
      // Return mock data as fallback for development
      if (import.meta.env.DEV) {
        console.warn('🎭 DEV FALLBACK: Using mock data - Set up your API endpoint to fetch from Notion');
        return this.getMockPosts();
      }
      
      // In production, still return mock data if API fails so the site doesn't break
      console.warn('🚨 PROD FALLBACK: API failed in production, falling back to mock data');
      return this.getMockPosts();
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    console.log('📡 getPostBySlug called for:', slug);
    
    // First, try to load from static data (individual post files)
    try {
      const staticUrl = `/static-data/post-${slug}.json`;
      console.log('📁 Attempting to fetch individual post:', staticUrl);
      
      const response = await fetch(staticUrl);
      console.log('📁 Individual post response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('📁 Individual post returned non-JSON:', contentType);
          throw new Error('Non-JSON response from individual post');
        }
        
        const post = await response.json();
        console.log('📁 Successfully loaded individual post from static data:', slug);
        return post;
      }
    } catch (error) {
      console.log('📡 Individual post static data failed:', error);
    }

    // Try to find in static posts.json
    try {
      console.log('📁 Trying to find post in posts.json...');
      const postsResponse = await fetch('/static-data/posts.json');
      console.log('📁 Posts.json response:', {
        ok: postsResponse.ok,
        status: postsResponse.status
      });
      
      if (postsResponse.ok) {
        const contentType = postsResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('📁 Posts.json returned non-JSON:', contentType);
          throw new Error('Non-JSON response from posts.json');
        }
        
        const posts = await postsResponse.json();
        const post = posts.find((p: BlogPost) => p.slug === slug);
        if (post) {
          console.log('📁 Found post in static posts data:', slug);
          return post;
        }
        console.log('📁 Post not found in static posts data:', slug);
      }
    } catch (error) {
      console.log('📡 Could not load static posts data:', error);
    }

    // Fallback to original API logic
    try {
      // First check if we have this post cached (within 30 minutes)
      const cachedEntry = Array.from(this.cache.values())
        .find(entry => entry.post.slug === slug);

      if (cachedEntry && (Date.now() - cachedEntry.cachedAt) < 30 * 60 * 1000) {
        const cacheAge = Math.round((Date.now() - cachedEntry.cachedAt) / 1000 / 60);
        console.log(`🎯 POST CACHE HIT: Using cached post "${slug}" (${cacheAge} minutes old)`);
        return cachedEntry.post;
      }

      if (cachedEntry) {
        const cacheAge = Math.round((Date.now() - cachedEntry.cachedAt) / 1000 / 60);
        console.log(`⏰ POST CACHE EXPIRED: Post "${slug}" cache is ${cacheAge} minutes old`);
      } else {
        console.log(`🆕 POST FRESH REQUEST: No cache found for "${slug}"`);
      }

      console.log(`🌐 FETCHING POST: "${slug}" from:`, this.apiUrl);
      const startTime = performance.now();
      const response = await fetch(`${this.apiUrl}?slug=${slug}`);
      const fetchTime = Math.round(performance.now() - startTime);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`❌ POST NOT FOUND: "${slug}" returned 404`);
          return null;
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ POST API ERROR:', {
          slug,
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      }
      
      const post = await response.json();
      console.log(`✅ POST FETCH SUCCESS: "${post.title}" fetched in ${fetchTime}ms`);
      
      // Update cache
      if (post.last_edited_time) {
        this.cache.set(post.id, {
          post,
          lastEditedTime: post.last_edited_time,
          cachedAt: Date.now()
        });
        console.log(`💾 POST CACHED: "${slug}" stored in individual cache`);
      }
      
      return post;
    } catch (error) {
      console.error(`💥 POST FETCH ERROR for "${slug}":`, error);
      
      // Return cached version if available
      const cachedEntry = Array.from(this.cache.values())
        .find(entry => entry.post.slug === slug);
        
      if (cachedEntry) {
        const cacheAge = Math.round((Date.now() - cachedEntry.cachedAt) / 1000 / 60);
        console.warn(`🔄 POST FALLBACK: Using stale cache for "${slug}" (${cacheAge} minutes old)`);
        return cachedEntry.post;
      }
      
      // Return mock data as fallback for development
      if (import.meta.env.DEV) {
        console.warn(`🎭 POST DEV FALLBACK: Using mock data for "${slug}"`);
        const mockPosts = this.getMockPosts();
        return mockPosts.find(post => post.slug === slug) || null;
      }
      
      // In production, still try to return mock data
      console.warn(`🚨 POST PROD FALLBACK: Using mock data for "${slug}"`);
      const mockPosts = this.getMockPosts();
      return mockPosts.find(post => post.slug === slug) || null;
    }
  }

  private getMockPosts(): BlogPost[] {
    return [
      {
        id: '1',
        title: 'Getting Started with Machine Learning',
        slug: 'getting-started-with-machine-learning',
        excerpt: 'A comprehensive guide to starting your journey in machine learning with practical examples and real-world applications.',
        content: `# Getting Started with Machine Learning

Machine learning is transforming industries and creating new possibilities every day. In this post, I'll share my journey and insights into getting started with ML.

## What is Machine Learning?

Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.

## Getting Started

1. **Learn the fundamentals** - Start with statistics and linear algebra
2. **Choose a programming language** - Python is highly recommended
3. **Practice with datasets** - Use platforms like Kaggle
4. **Build projects** - Apply your knowledge to real problems

## Resources

- **Books**: "Hands-On Machine Learning" by Aurélien Géron
- **Courses**: Andrew Ng's Machine Learning Course
- **Practice**: Kaggle competitions

Happy learning!`,
        publishedDate: '2024-01-15',
        tags: ['Machine Learning', 'Data Science', 'Python'],
        status: 'Published',
        coverImage: ''
      },
      {
        id: '2',
        title: 'Building MLOps Pipelines',
        slug: 'building-mlops-pipelines',
        excerpt: 'Learn how to build robust MLOps pipelines for production machine learning systems with CI/CD best practices.',
        content: `# Building MLOps Pipelines

MLOps combines machine learning, DevOps, and data engineering to deploy and maintain ML systems in production reliably and efficiently.

## Key Components

### 1. Version Control
- Model versioning
- Data versioning  
- Code versioning

### 2. Automated Testing
- Unit tests for ML code
- Integration tests
- Model validation tests

### 3. Deployment Strategies
- Blue-green deployments
- Canary releases
- A/B testing

## Tools and Technologies

- **ML Platforms**: MLflow, Kubeflow
- **Containerization**: Docker, Kubernetes
- **CI/CD**: GitHub Actions, Jenkins
- **Monitoring**: Prometheus, Grafana

Building robust MLOps pipelines is essential for scaling ML systems in production.`,
        publishedDate: '2024-01-08',
        tags: ['MLOps', 'DevOps', 'Production'],
        status: 'Published',
        coverImage: ''
      }
    ];
  }
}

export const notionService = new NotionService();