# Doc0 - AI-Powered Documentation Chat

Doc0 is a modern, AI-powered documentation search and chat application that helps users interact with documentation in a natural, conversational way. Built with Next.js, TypeScript, and Tailwind CSS, it provides a beautiful and intuitive interface for documentation exploration.

## Features

- **AI-Powered Chat Interface**: Interact with documentation through natural language conversations
- **Semantic Search**: Powered by vector embeddings to understand the intent behind your queries
- **Multi-Document Support**: Search across multiple documentation sources simultaneously
- **Chat History**: Save and revisit previous conversations
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Modern UI**: Dark mode interface with clean, modern design inspired by leading AI tools

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend-nextjs
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js 13+ App Router
  - `/page.tsx` - Main landing page
  - `/chat/page.tsx` - Chat interface
  - `/api` - API routes for search and AI functionality
- `/components` - Reusable UI components
- `/lib` - Utility functions, state management, and API services
- `/public` - Static assets

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Data Storage**: IndexedDB (browser local storage)
- **AI Integration**: Vector search for semantic document retrieval

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by modern AI chat interfaces
- Documentation search powered by semantic vector search 