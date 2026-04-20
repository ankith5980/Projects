from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import os
import shutil
from core.graph import run_analysis_stream

app = FastAPI(title="AI Data Analysis System Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For next.js local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    return {"info": f"file '{file.filename}' saved at '{file_location}'", "path": file_location}

@app.get("/")
async def root():
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            task = payload.get("task", "Analyze this data.")
            csv_file_path = payload.get("csv_file_path")
            
            # Stream events from the LangGraph pipeline
            async for event in run_analysis_stream(task, csv_file_path):
                await websocket.send_text(json.dumps(event))
            
            await websocket.send_text(json.dumps({"type": "done"}))
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket")
