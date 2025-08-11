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
  private metadataUrl: string;
  private cache = new Map<string, CachedPost>();
  private postsCache: PostsCache | null = null;
  private staticMode: boolean;

  constructor() {
    // Detect if we're in static mode (static data available)
    this.staticMode = false;
    
    // Use environment variable if available, otherwise determine based on current environment
    if (import.meta.env.VITE_API_URL) {
      this.apiUrl = import.meta.env.VITE_API_URL;
      this.metadataUrl = import.meta.env.VITE_API_URL;
    } else if (typeof window !== 'undefined') {
      // Client-side: use window.location
      this.apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/notion'
        : '/api/notion';
      this.metadataUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/metadata'
        : '/api/metadata';
    } else {
      // Server-side: use production URLs
      this.apiUrl = '/api/notion';
      this.metadataUrl = '/api/metadata';
    }
  }

  // Try to load static data first, fall back to API
  async tryStaticFirst(loader: () => Promise<any>, fallback: () => Promise<any>) {
    try {
      return await loader();
    } catch (error) {
      console.log('Static data not available, falling back to API');
      return await fallback();
    }
  }

  async getPosts(): Promise<BlogPost[]> {
    // First, try to load from static data (generated at build time)
    try {
      const response = await fetch('/static-data/posts.json');
      if (response.ok) {
        const posts = await response.json();
        console.log('📁 Loaded posts from static data');
        return posts;
      }
    } catch (error) {
      console.log('📡 Static data not available, trying cache and API...');
    }

    // Fallback to cache checking and API
    try {
      // Check if we have recent posts and get metadata to see if anything changed
      if (this.postsCache) {
        console.log('Checking for post updates...');
        
        try {
          const metadataResponse = await fetch(this.metadataUrl);
          
          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            
            // Check if any post has been updated since our last cache
            const needsUpdate = metadata.some((meta: any) => {
              const cached = this.cache.get(meta.id);
              return !cached || cached.lastEditedTime !== meta.last_edited_time;
            });

            if (!needsUpdate) {
              console.log('All posts up to date, using cache');
              return this.postsCache.posts;
            }
            
            console.log('Some posts have been updated, fetching fresh data');
          }
        } catch (metadataError) {
          console.warn('Failed to check metadata, using existing cache if available');
          if (this.postsCache) {
            return this.postsCache.posts;
          }
        }
      }

      return await this.tryStaticFirst(
        // Try static data first
        async () => {
          console.log('Loading posts from static data...');
          const response = await fetch('/static-data/posts.json');
          if (!response.ok) throw new Error('Static data not available');
          const posts = await response.json();
          console.log('Successfully loaded', posts.length, 'posts from static data');
          
          // Update cache
          this.postsCache = { posts, lastFetch: Date.now() };
          posts.forEach((post: BlogPost) => {
            if (post.last_edited_time) {
              this.cache.set(post.id, {
                post,
                lastEditedTime: post.last_edited_time,
                cachedAt: Date.now()
              });
            }
          });
          
          return posts;
        },
        // Fallback to API
        async () => {
          console.log('Fetching fresh posts from:', this.apiUrl);
          const response = await fetch(this.apiUrl);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Response:', {
              status: response.status,
              statusText: response.statusText,
              errorData
            });
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
          }
          
          const posts = await response.json();
          console.log('Successfully fetched posts:', posts.length);
          
          // Update cache
          this.postsCache = { posts, lastFetch: Date.now() };
          
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
          
          return posts;
        }
      );
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Return cached posts if available
      if (this.postsCache) {
        console.warn('Using cached posts due to fetch error');
        return this.postsCache.posts;
      }
      
      // Return mock data as fallback for development
      if (import.meta.env.DEV) {
        console.warn('Using mock data - Set up your API endpoint to fetch from Notion');
        return this.getMockPosts();
      }
      
      // In production, still return mock data if API fails so the site doesn't break
      console.warn('API failed in production, falling back to mock data');
      return this.getMockPosts();
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // First, try to load from static data (individual post files)
    try {
      const response = await fetch(`/static-data/post-${slug}.json`);
      if (response.ok) {
        const post = await response.json();
        console.log('📁 Loaded post from static data:', slug);
        return post;
      }
    } catch (error) {
      console.log('📡 Static data not available for post, trying other methods...', slug);
    }

    // Try to find in static posts.json
    try {
      const postsResponse = await fetch('/static-data/posts.json');
      if (postsResponse.ok) {
        const posts = await postsResponse.json();
        const post = posts.find((p: BlogPost) => p.slug === slug);
        if (post) {
          console.log('📁 Found post in static posts data:', slug);
          return post;
        }
      }
    } catch (error) {
      console.log('📡 Could not load static posts data');
    }

    // Fallback to original API logic
    try {
      return await this.tryStaticFirst(
        // Try static data first (this is now redundant but kept for compatibility)
        async () => {
          console.log('Loading post from static data (fallback):', slug);
          const response = await fetch(`/static-data/post-${slug}.json`);
          if (!response.ok) throw new Error('Static post not available');
          const post = await response.json();
          console.log('Successfully loaded post from static data:', post.title);
          
          // Update cache
          if (post.last_edited_time) {
            this.cache.set(post.id, {
              post,
              lastEditedTime: post.last_edited_time,
              cachedAt: Date.now()
            });
          }
          
          return post;
        },
        // Fallback to API with caching logic
        async () => {
          // First check if we have this post cached
          const cachedEntry = Array.from(this.cache.values())
            .find(entry => entry.post.slug === slug);

          if (cachedEntry) {
            console.log('Found cached post for slug:', slug);
            
            // Check if the cached post is still fresh by comparing last_edited_time
            try {
              const metadataResponse = await fetch(`${this.metadataUrl}?slug=${slug}`);
              
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                
                if (metadata.last_edited_time === cachedEntry.lastEditedTime) {
                  console.log('Post up to date, using cache for:', slug);
                  return cachedEntry.post;
                }
                
                console.log('Post has been updated, fetching fresh data for:', slug);
              }
            } catch (metadataError) {
              console.warn('Failed to check metadata for:', slug, 'using cached version');
              return cachedEntry.post;
            }
          }

          console.log('Fetching fresh post by slug:', slug, 'from:', this.apiUrl);
          const response = await fetch(`${this.apiUrl}?slug=${slug}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              return null;
            }
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Response:', {
              status: response.status,
              statusText: response.statusText,
              errorData
            });
            throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
          }
          
          const post = await response.json();
          console.log('Successfully fetched post:', post.title);
          
          // Update cache
          if (post.last_edited_time) {
            this.cache.set(post.id, {
              post,
              lastEditedTime: post.last_edited_time,
              cachedAt: Date.now()
            });
          }
          
          return post;
        }
      );
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      
      // Return cached version if available
      const cachedEntry = Array.from(this.cache.values())
        .find(entry => entry.post.slug === slug);
        
      if (cachedEntry) {
        console.warn('Using cached post due to fetch error:', slug);
        return cachedEntry.post;
      }
      
      // Return mock data as fallback
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