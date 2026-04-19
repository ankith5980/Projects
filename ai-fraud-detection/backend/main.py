from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
import json
import asyncio

app = FastAPI(title="AI Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

@app.get("/api/transactions/recent")
async def get_recent_transactions():
    """Fetch the latest 100 transactions"""
    try:
        txs = await redis_client.lrange('recent_transactions', 0, -1)
        return [json.loads(tx) for tx in txs]
    except Exception as e:
        print(f"Redis error: {e}")
        return []

@app.get("/api/alerts/recent")
async def get_recent_alerts():
    """Fetch the latest 100 fraud alerts"""
    try:
        alerts = await redis_client.lrange('recent_alerts', 0, -1)
        return [json.loads(alert) for alert in alerts]
    except Exception as e:
        print(f"Redis error: {e}")
        return []

@app.get("/api/stats")
async def get_stats():
    """Get basic overall stats"""
    try:
        total_tx_count = await redis_client.llen('recent_transactions')
        total_alert_count = await redis_client.llen('recent_alerts')
        
        return {
            "processed_last_100": total_tx_count,
            "alerts_last_100": total_alert_count
        }
    except Exception as e:
        print(f"Redis error: {e}")
        return {
            "processed_last_100": 0,
            "alerts_last_100": 0
        }

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    
    pubsub = redis_client.pubsub()
    await pubsub.subscribe('fraud_alerts_channel')
    
    try:
        while True:
            # Check for disconnects
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message:
                await websocket.send_text(message['data'])
            else:
                # Add a small delay to prevent high CPU usage if no msg
                await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        await pubsub.unsubscribe('fraud_alerts_channel')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
