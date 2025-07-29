
# Harman Punn - Portfolio Website

Welcome to my portfolio website repository! This project showcases my skills, experience, and projects in a clean, responsive interface.

## Project Overview

This portfolio website is built with modern web technologies to create a seamless and responsive user experience. It includes sections for:

- Introduction
- About Me
- Skills & Expertise
- Work Experience
- Education
- Projects
- Blog (powered by Notion CMS)
- Contact Information

## Live Demo

Visit the live website at: [harmanpunn.me](https://harmanpunn.me)

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible UI components
- **React Router**: Client-side routing
- **Notion API**: CMS for blog content management
- **React Query**: Data fetching and caching
- **Vercel**: Hosting and serverless functions

## Setup and Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn or bun (package manager)

### Local Development

```bash
# Clone the repository
git clone https://github.com/harmanpunn/portfolio-website-harman.git
cd portfolio-website-harman

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start the development server
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at http://localhost:5173 (or your configured port).

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
# or
bun build

# Preview the production build locally
npm run preview
# or
yarn preview
# or
bun preview
```

### Environment Variables

For the blog functionality to work, you need to set up Notion integration:

1. Create a `.env` file in the root directory
2. Add your Notion credentials:

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

Refer to `NOTION_SETUP_GUIDE.md` for detailed setup instructions.

## Project Structure

```
portfolio-website-harman/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and Notion service
│   ├── pages/           # Page components (Index, Blog, BlogPost, NotFound)
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── api/                 # Vercel serverless functions
├── index.html           # HTML template
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```


