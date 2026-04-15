import json
import asyncio
import uuid
import tkinter as tk
from tkinter import filedialog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from agents import research_graph
from faiss_loader import ingest_folder
from models import ResearchRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/browse")
async def browse_folder():
    def get_folder():
        root = tk.Tk()
        root.attributes('-topmost', True)
        root.withdraw()
        folder_path = filedialog.askdirectory(title="Select Knowledge Base Folder")
        root.destroy()
        return folder_path
        
    path = await asyncio.to_thread(get_folder)
    return {"path": path}

@app.post("/api/ingest")
async def ingest_documents(request: Request):
    data = await request.json()
    folder = data.get("folder_path")
    if not folder:
        return {"status": "error", "message": "folder_path is required"}
    
    result = await asyncio.to_thread(ingest_folder, folder)
    if result:
        return {"status": "success", "message": "Index built successfully"}
    return {"status": "error", "message": "Failed to build index. Check path or folder content."}

@app.get("/api/research/stream")
async def research_stream(query: str, request: Request):
    task_id = str(uuid.uuid4())
    inputs = {"query": query, "task_id": task_id, "status_updates": []}
    
    async def event_generator():
        yield f"event: start\ndata: {json.dumps({'task_id': task_id, 'message': 'System starting...'})}\n\n"
        
        try:
            async for step_result in research_graph.astream(inputs):
                if await request.is_disconnected():
                    break
                
                node_name = list(step_result.keys())[0]
                state_update = step_result[node_name]
                
                updates = state_update.get("status_updates", [])
                if updates:
                    latest_msg = updates[-1]
                    yield f"event: update\ndata: {json.dumps({'node': node_name, 'message': latest_msg})}\n\n"
                
                if node_name == "writer" and "report" in state_update:
                    yield f"event: complete\ndata: {json.dumps({'report': state_update['report']})}\n\n"
            
            yield f"event: done\ndata: Stream finished\n\n"
        except Exception as e:
            print("STREAM ERROR:", e)
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
