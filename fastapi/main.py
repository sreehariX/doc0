from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime

app = FastAPI(
    title="Documentation Query API",
    description="API for querying documentation using ChromaDB and Gemini"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://doc0.vercel.app/"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"]  
)




load_dotenv()
CHROMA_SERVER_HOST = os.getenv("CHROMA_SERVER_HOST")

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
chroma_client = chromadb.HttpClient(
    host="CHROMA_SERVER_HOST", 
    port=8000
)

class QueryRequest(BaseModel):
    query: str
    collection_name: str  

def get_embedding(text: str):
 
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text
    )
    return result['embedding']

def get_gemini_summary(documents, sources):
   
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction="""You are a technical documentation assistant. Your task is to:
    1. Analyze the provided documentation snippets
    2. Create a clear, concise summary that combines the key information
    3. Maintain technical accuracy
    
    4. Format the response in a well-structured way
    5. If there are any code examples or CLI commands, highlight them in code blocks"""
    )
    
   
    content_prompt = "Here are the documentation sections to summarize:\n\n"
    for doc, source in zip(documents, sources):
        content_prompt += f"Content: {doc}\nSource: {source}\n\n"
    content_prompt += "\nPlease provide a comprehensive summary of the above information, including source links."
    
    response = model.generate_content(content_prompt)
    return response.text

@app.get("/")
async def root():
    
    return {"message": "Documentation Query API is running"}

@app.post("/query")
async def query_docs_endpoint(request: QueryRequest):
    try:
        # Validate collection name
        valid_collections = ['docs_react', 'docs_nextjs', 'docs_astro', 'docs_kestra', 'docs_redux']
        if request.collection_name not in valid_collections:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid collection name. Must be one of: {', '.join(valid_collections)}"
            )
        
        # Get the collection directly using the provided name
        collection = chroma_client.get_collection(request.collection_name)
        
        # Rest of the query logic remains the same
        query_embedding = get_embedding(request.query)
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3,
            include=['documents', 'metadatas', 'distances']
        )
        
        formatted_results = []
        for i in range(len(results['documents'][0])):
            result = {
                'document': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'similarity_score': 1 - results['distances'][0][i]
            }
            formatted_results.append(result)
        
        documents = [r['document'] for r in formatted_results]
        sources = [r['metadata'].get('url', 'No source available') for r in formatted_results]
        
        summary = get_gemini_summary(documents, sources)
        
        output = {
            'query': request.query,
            'collection_name': request.collection_name,
            'timestamp': datetime.now().isoformat(),
            'results': formatted_results,
            'summary': summary
        }
        
        return output
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)