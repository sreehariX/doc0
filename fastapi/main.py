from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from google import genai
import os
import yaml
import uuid
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from google.genai.types import EmbedContentConfig

app = FastAPI(
    title="Golem Documentation Search",
    description="Search Golem Documentation with Vector Embeddings"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
CHROMA_SERVER_HOST = os.getenv("CHROMA_SERVER_HOST")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

chroma_client = chromadb.HttpClient(
    host=CHROMA_SERVER_HOST, 
    port=8000
)

# chroma_client = chromadb.PersistentClient(path="golem_chroma_db")

class QueryRequest(BaseModel):
    query: str
    n_results: int = 10  # Default value of 10 if not specified

class EmbeddingRequest(BaseModel):
    text: str

class TestGeminiRequest(BaseModel):
    prompt: str = "How does golem work ?"

class EnhanceQueryCLIRequest(BaseModel):
    query: str
    n_results: int = 10

class RawQueryCLIRequest(BaseModel):
    query: str
    n_results: int = 10

def get_embedding(text: str, title="Golem Documentation"):
    response = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text,
        config=EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=768,
            title=title,
        ),
    )
    # Return the embedding values from the first content
    return response.embeddings[0].values

def split_content_by_tokens(content, max_tokens=2000, chars_per_token=4):
    """Fast and reliable content chunking by character count.
    Converts newlines to spaces and normalizes spacing for consistent processing.
    """
    # Normalize newlines to spaces and remove multiple spaces
    normalized_content = content.replace('\n', ' ').replace('\r', ' ')
    normalized_content = ' '.join(normalized_content.split())
    
    max_chars = max_tokens * chars_per_token
    
    # Quick return if content fits in one chunk
    if len(normalized_content) <= max_chars:
        return [normalized_content]
    
    chunks = []
    start = 0
    
    while start < len(normalized_content):
        # Determine end position of this chunk
        end = min(start + max_chars, len(normalized_content))
        
        # If we're not at the end of the content, find last space
        if end < len(normalized_content):
            # Look for the last space within the chunk
            last_space = normalized_content.rfind(' ', start, end)
            
            if last_space != -1:  # If we found a space
                end = last_space  # Cut at the space
            # If no space found (very rare for large chunks), we'd cut at max_chars
        
        # Add the chunk and move to next position
        chunks.append(normalized_content[start:end])
        start = end + 1  # Skip the space
    
    return chunks

def load_golem_docs_to_chroma(yaml_path: str):
    # Load YAML file
    with open(yaml_path, 'r', encoding='utf-8') as file:
        data = yaml.safe_load(file)
    
    collection = chroma_client.get_or_create_collection(name="golem_docs_v1", metadata={"hnsw:space": "cosine"})
    
    # Check if collection is empty
    if collection.count() == 0:
        print("ChromaDB collection is empty. Loading Golem documentation...")
        documents = []
        embeddings = []
        metadatas = []
        ids_list = []
        
        for doc in data.get('golem', []):
            content = doc.get('content', '').strip()
            
            if content:
                # Split content if it exceeds token limit
                content_chunks = split_content_by_tokens(content)
                
                for i, chunk in enumerate(content_chunks):
                    try:
                        # Create metadata directly from the YAML entry, excluding content
                        metadata = {k: str(v) for k, v in doc.items() if k != 'content'}
                        
                        # Add only chunk index information
                        metadata['chunk_index'] = str(i)
                        metadata['total_chunks'] = str(len(content_chunks))
                        
                        # Extract id_parent for logging
                        id_parent = doc.get('id_parent', 'unknown')
                        
                        # Pass the title for embedding context
                        embedding = get_embedding(chunk, title=doc.get('title', 'Golem Documentation'))
                        documents.append(chunk)
                        embeddings.append(embedding)
                        metadatas.append(metadata)
                        ids_list.append(str(uuid.uuid4()))
                        
                        # Print with id_parent for tracking
                        print(f"Processed document: ID {id_parent} - {doc.get('title', 'Untitled')} (chunk {i+1}/{len(content_chunks)})")
                    except Exception as e:
                        id_parent = doc.get('id_parent', 'unknown')
                        print(f"Error processing document chunk {i+1} from ID {id_parent} - {doc.get('title', '')}: {str(e)}")
        
        try:
            collection.upsert(
                ids=ids_list,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas
            )
            print(f"Loaded {len(documents)} document chunks into ChromaDB")
            
            # Print summary of parent IDs processed
            parent_ids = {}
            for metadata in metadatas:
                parent_id = metadata.get('id_parent', 'unknown')
                parent_ids[parent_id] = parent_ids.get(parent_id, 0) + 1
            
            print("\nSummary of Parent IDs processed:")
            for parent_id, count in parent_ids.items():
                print(f"  Parent ID {parent_id}: {count} chunks")
            print(f"Total unique parent IDs: {len(parent_ids)}")
            
        except Exception as e:
            print(f"Error during upsert: {str(e)}")
            for i in range(min(5, len(metadatas))):
                print(f"Sample metadata {i}: {metadatas[i]}")
    else:
        print(f"ChromaDB collection already contains {collection.count()} documents")
        
        # Print summary of parent IDs in the existing collection
        try:
            results = collection.get(include=['metadatas'])
            if results and 'metadatas' in results and results['metadatas']:
                parent_ids = {}
                for metadata in results['metadatas']:
                    parent_id = metadata.get('id_parent', 'unknown')
                    parent_ids[parent_id] = parent_ids.get(parent_id, 0) + 1
                
                print("\nSummary of Parent IDs in existing collection:")
                for parent_id, count in parent_ids.items():
                    print(f"  Parent ID {parent_id}: {count} chunks")
                print(f"Total unique parent IDs: {len(parent_ids)}")
        except Exception as e:
            print(f"Error getting parent ID summary: {str(e)}")

@app.on_event("startup")
async def startup_db_client():
    try:
        yaml_path = "golem_docs.yaml"
        if os.path.exists(yaml_path):
            load_golem_docs_to_chroma(yaml_path)
        else:
            print(f"Warning: YAML file {yaml_path} not found")
    except Exception as e:
        print(f"Error initializing ChromaDB: {str(e)}")

@app.post("/query")
async def query_docs(request: QueryRequest):
    try:
        query_embedding = get_embedding(request.query)
        collection = chroma_client.get_collection("golem_docs_v1")
        
        # Execute the query without any filters
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=request.n_results,
            include=['documents', 'metadatas', 'distances']
        )
        
        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                result = {
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'similarity_score': 1 - results['distances'][0][i]
                }
                formatted_results.append(result)
        
        return {
            "results": formatted_results
        }
    
    except Exception as e:
        print(f"Error in query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/test")
async def test_embedding(request: EmbeddingRequest):
    try:
        embedding = get_embedding(request.text)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/testgeminiflash")
async def test_gemini_flash(request: TestGeminiRequest):
    try:
        # Generate content using gemini-2.0-flash model
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=request.prompt
        )
        
        # Return the generated content
        return {"response": response.text}
    
    except Exception as e:
        print(f"Error in test gemini flash: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Golem Documentation Search API - Use /docs to see the API documentation"}

@app.get("/chromadb-stats")
async def get_chromadb_stats():
    try:
        collection = chroma_client.get_collection("golem_docs_v1")
        
        # Get total count
        total_count = collection.count()
        
        # Get all metadata for analysis
        results = collection.get(include=['metadatas'])
        
        # Track various statistics
        titles = {}    # Count documents per title
        url_domains = {}  # Track documentation domains
        content_stats = {
            "total_chunks": total_count,
            "avg_chunk_size": 0,
            "max_chunk_size": 0,
            "multi_chunk_docs": 0
        }
        
        total_chars = 0
        max_chunk_index = -1
        doc_chunk_counts = {}  # Track how many chunks each document has
        
        if results and 'metadatas' in results and results['metadatas']:
            for metadata in results['metadatas']:
                if not metadata:
                    continue
                
                # Track titles
                title = metadata.get('title', 'untitled')
                titles[title] = titles.get(title, 0) + 1
                
                # Track URL domains
                url = metadata.get('url', '')
                if url:
                    domain = url.split('//')[1].split('/')[0] if '//' in url else url.split('/')[0]
                    url_domains[domain] = url_domains.get(domain, 0) + 1
                
                # Track document chunks
                doc_id = metadata.get('id_parent', '')
                chunk_index = int(metadata.get('chunk_index', 0))
                total_chunks = int(metadata.get('total_chunks', 1))
                
                # Update document chunk tracking
                if doc_id not in doc_chunk_counts:
                    doc_chunk_counts[doc_id] = total_chunks
                
                # Track largest chunk index
                if chunk_index > max_chunk_index:
                    max_chunk_index = chunk_index
                
                # Track character counts if available
                if 'char_count' in metadata:
                    try:
                        char_count = int(metadata['char_count'])
                        total_chars += char_count
                        if char_count > content_stats["max_chunk_size"]:
                            content_stats["max_chunk_size"] = char_count
                    except (ValueError, TypeError):
                        pass
        
        # Calculate additional statistics
        multi_chunk_docs = sum(1 for count in doc_chunk_counts.values() if count > 1)
        content_stats["multi_chunk_docs"] = multi_chunk_docs
        
        if total_count > 0:
            content_stats["avg_chunk_size"] = total_chars / total_count if total_chars > 0 else "Unknown"
        
        # Sort titles by frequency (most common first)
        sorted_titles = sorted(titles.items(), key=lambda x: x[1], reverse=True)
        
        # Get the top 10 most common titles
        top_titles = sorted_titles[:10]
        
        return {
            "collection_info": {
                "name": "golem_docs_v1",
                "total_records": total_count,
                "unique_documents": len(doc_chunk_counts),
                "multi_chunk_documents": multi_chunk_docs,
                "max_chunks_per_document": max(doc_chunk_counts.values()) if doc_chunk_counts else 0
            },
            "content_statistics": content_stats,
            "document_titles": {
                "unique_titles": len(titles),
                "top_titles": dict(top_titles)
            },
            "url_domains": url_domains
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/inspect")
async def inspect_database():
    try:
        collection = chroma_client.get_collection("golem_docs_v1")
        count = collection.count()
        
        if count == 0:
            return {"status": "empty", "message": "No documents in database"}
        
        # Get sample documents
        sample = collection.get(limit=5)
        
        # Extract metadata fields
        metadata_fields = set()
        for metadata in sample['metadatas']:
            metadata_fields.update(metadata.keys())
        
        return {
            "status": "populated",
            "document_count": count,
            "metadata_fields": list(metadata_fields),
            "sample_documents": [
                {
                    "id": sample['ids'][i],
                    "metadata": sample['metadatas'][i],
                    "document_preview": sample['documents'][i][:100] + "..."
                }
                for i in range(min(3, len(sample['ids'])))
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/enhance-query-cli")
async def enhance_query_cli(request: EnhanceQueryCLIRequest):
    try:
        # Step 1: Enhance the query for better vector search
        enhanced_query_response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
            You are a search query enhancer for Golem documentation search system.
            Your task is to improve the user's search query to make it more effective for semantic search in a vector database.
            
            Original query: "{request.query}"
            
            Enhance this query by:
            1. Expanding the user query to make it more accurate in vector database search
            2. Expanding abbreviations like 'CLI' to 'Command Line Interface'
            3. Including synonyms for technical terms
            4. Improving specificity while maintaining the original intent
            
            Return ONLY the enhanced query text with no explanations or additional text.
            """
        )
        
        enhanced_query = enhanced_query_response.text.strip()
        
        # Step 2: Query the vector database with the enhanced query
        query_embedding = get_embedding(enhanced_query)
        collection = chroma_client.get_collection("golem_docs_v1")
        
        # Execute the query without filters
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=request.n_results,
            include=['documents', 'metadatas', 'distances']
        )
        
        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                result = {
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'similarity_score': 1 - results['distances'][0][i]
                }
                formatted_results.append(result)
        
        # If no results found, return early
        if not formatted_results:
            return {
                "enhanced_query": enhanced_query,
                "summary": "No results found for your query.",
                "results": []
            }
            
        # Step 3: Format the results into a structured text for Gemini
        formatted_content = ""
        for index, result in enumerate(formatted_results):
            formatted_content += f"""
Document {index + 1}: {result['metadata']['title']}
Content: {result['document']}
URL: {result['metadata']['url']}
Similarity Score: {(result['similarity_score'] * 100):.1f}%
"""
        
        # Step 4: Use Gemini to summarize the results based on the original query
        summary_response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
You are a technical documentation assistant for Golem. Your task is to answer the user's question using the provided documentation snippets.

Follow these guidelines when creating your response:
1. Answer the question clearly and concisely based on the documentation provided
2. Maintain technical accuracy and use Golem terminology correctly
3. Format your response with proper markdown for readability
4. When referencing specific parts of the documentation, use citations like [1], [2], etc.
5. For code examples or commands, use proper markdown code blocks with appropriate syntax highlighting
6. At the end of your response, include a "References" section with numbered links to the source documentation
7. IMPORTANT: In the References section, ensure each unique URL appears only once. Do not duplicate URLs.

User question: {request.query}

Here are the documentation snippets:
{formatted_content}
"""
        )
        
        # Return the enhanced query, Gemini-generated summary, and the raw search results
        return {
            "enhanced_query": enhanced_query,
            "summary": summary_response.text,
            "results": formatted_results
        }
    
    except Exception as e:
        print(f"Error in enhance query CLI: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rawquery-cli")
async def raw_query_cli(request: RawQueryCLIRequest):
    try:
        # Use the raw query directly for vector search (no enhancement)
        query_embedding = get_embedding(request.query)
        collection = chroma_client.get_collection("golem_docs_v1")
        
        # Execute the query without filters
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=request.n_results,
            include=['documents', 'metadatas', 'distances']
        )
        
        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                result = {
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'similarity_score': 1 - results['distances'][0][i]
                }
                formatted_results.append(result)
        
        # If no results found, return early
        if not formatted_results:
            return {
                "summary": "No results found for your query.",
                "results": []
            }
            
        # Format the results into a structured text for Gemini
        formatted_content = ""
        for index, result in enumerate(formatted_results):
            formatted_content += f"""
Document {index + 1}: {result['metadata']['title']}
Content: {result['document']}
URL: {result['metadata']['url']}
Similarity Score: {(result['similarity_score'] * 100):.1f}%
"""
        
        # Use Gemini to summarize the results based on the original query
        summary_response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
You are a technical documentation assistant for Golem. Your task is to answer the user's question using the provided documentation snippets.

Follow these guidelines when creating your response:
1. Answer the question clearly and concisely based on the documentation provided
2. Maintain technical accuracy and use Golem terminology correctly
3. Format your response with proper markdown for readability
4. When referencing specific parts of the documentation, use citations like [1], [2], etc.
5. For code examples or commands, use proper markdown code blocks with appropriate syntax highlighting
6. At the end of your response, include a "References" section with numbered links to the source documentation
7. IMPORTANT: In the References section, ensure each unique URL appears only once. Do not duplicate URLs.

User question: {request.query}

Here are the documentation snippets:
{formatted_content}
"""
        )
        
        # Return the Gemini-generated summary and the raw search results
        return {
            "summary": summary_response.text,
            "results": formatted_results
        }
    
    except Exception as e:
        print(f"Error in raw query CLI: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)