<div align="center">
  

![Screenshot 2024-12-01 231908](https://github.com/user-attachments/assets/cc3c4007-a255-45fb-a453-17fb2c7bf24e)

[Website] | [Getting Started] | [Live Demo Video]
</div>

This is the main source code repository for doc0, an AI-powered documentation chat interface that allows users to interact with technical documentation giving accurate results.

## Why doc0?

- **Smart Documentation Search:** Leverages ChromaDB for semantic search across multiple framework documentations
- **Multi-Framework Support:** Currently supports Kestra, React, Next.js, Astro, and Redux documentation
- **Accurate results:** Give accurate results with latest documentation including source links 
- **Authentication** Google OAuth integration with request limiting for free users


## Youtube demo video 

[![Doc0 Demo](https://img.youtube.com/vi/QgL8jfBxz9s/maxresdefault.jpg)](https://www.youtube.com/watch?v=QgL8jfBxz9s)

## Quick Start

1. Clone the repository
2. Follow the [Installation Guide](#installation)
3. Start developing with `npm run dev` for frontend and `uvicorn main:app --reload` for backend

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Google OAuth credentials
- Gemini API key
- ChromaDB server

## Installation
### Frontend Setup

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/sreehariX/doc0
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd fastapi
   ```

2. **Create & Activate Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   CHROMA_SERVER_HOST=your_chromadb_server_url
   ```

5. **Start Development Server**
   ```bash
   uvicorn main:app --reload
   ```

## Features

### Documentation Search
- Semantic search powered by ChromaDB
- Support for multiple framework documentations
- Gives most accurate summary response

### Authentication & Rate Limiting
- Google OAuth integration
- 10 free requests per day for non-authenticated users
- Unlimited requests for authenticated users until we run out of google credits

### Modern UI Features
- Responsive design for all devices
- Code syntax highlighting

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management

### Backend
- FastAPI
- ChromaDB for vector search
- Google Gemini AI for response generation
- Python scrapers for documentation collection


## Hosting 

- Kestra is hosted on azure vm 16gb 2vcpu  using docker
- Chromadb is also hosted on azure vm 16gb 2vcpu  using docker
- Fastapi is hosted on azure vm 8gb 2vcpu using apache server for configuration


## Kestra 


- By using kestra we are automating the vectore embedding proecess
- Whenever i upload a file in azure blob storage it will trigger kestra to run a flow
- The flow execution will connect to chromadb server and make the chromadb embedded collection of the csv file
![Screenshot 2024-12-01 233229](https://github.com/user-attachments/assets/cdce15b6-2b32-4861-874f-0c45849e8e0e)
## Documentation Scraping

The project includes custom scrapers for:
- React documentation
- Next.js documentation
- Redux documentation
- Astro documentation
- Kestra documentation

Each scraper out is csv file using that you can embed in vector database.

## Contributing

We welcome contributions! Please see commit your messages properly

## License

MIT License

[Website]: https://doc0.vercel.app/
[Getting Started]: #quick-start
[Live Demo Video]: https://youtu.be/QgL8jfBxz9s?si=_5f9TBM6-iT-zhVb
