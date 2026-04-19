import json
import time
import os
import joblib
import pandas as pd
import redis
from confluent_kafka import Consumer, KafkaError

KAFKA_BROKER = 'localhost:9092'
TOPIC = 'transactions'
REDIS_HOST = 'localhost'
REDIS_PORT = 6379

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

# Load Model
model_path = os.path.join(os.path.dirname(__file__), '../ml/isolation_forest.pkl')
try:
    model = joblib.load(model_path)
    print("Model loaded successfully")
except FileNotFoundError:
    print(f"Warning: Model not found at {model_path}. Please run train_model.py first.")
    model = None

# Initialize Kafka Consumer
conf = {
    'bootstrap.servers': KAFKA_BROKER,
    'group.id': 'fraud_detection_group',
    'auto.offset.reset': 'latest'
}
consumer = Consumer(**conf)
consumer.subscribe([TOPIC])

def process_transaction(tx):
    user_id = tx['user_id']
    amount = tx['amount']
    timestamp = tx['timestamp']
    
    # Use Redis to keep track of user transaction velocity in the last 10 minutes (600 seconds)
    # We use a Sorted Set where score is timestamp
    current_time = time.time()
    redis_key = f"user_tx_history:{user_id}"
    
    # Add current tx
    r.zadd(redis_key, {json.dumps(tx): current_time})
    # Remove older than 10 minutes
    r.zremrangebyscore(redis_key, 0, current_time - 600)
    # Set expiry on key to 10 mins so we don't leak memory
    r.expire(redis_key, 600)
    
    # Get velocity
    velocity = r.zcard(redis_key)
    
    is_fraud = False
    
    if model:
        # Prepare features
        X = pd.DataFrame({'amount': [amount], 'velocity': [velocity]})
        # predict returns 1 for inliers, -1 for outliers
        prediction = model.predict(X)[0]
        if prediction == -1:
            is_fraud = True
            
    # Add score and fraud status to tx
    tx['velocity'] = velocity
    tx['is_fraud'] = is_fraud
    
    publish_result(tx)
    
def publish_result(tx):
    # Publish to Redis PubSub for FastAPI Websocket
    r.publish('fraud_alerts_channel', json.dumps(tx))
    
    # Also keep a list of the last 100 transactions for initial page load
    r.lpush('recent_transactions', json.dumps(tx))
    r.ltrim('recent_transactions', 0, 99)
    
    if tx['is_fraud']:
        print(f"🚨 FRAUD DETECTED: {tx['amount']} from {tx['user_id']}")
        r.lpush('recent_alerts', json.dumps(tx))
        r.ltrim('recent_alerts', 0, 99)

def run_consumer():
    print(f"Starting consumer, listening to '{TOPIC}'...")
    while True:
        msg = consumer.poll(1.0)
        
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break
                
        # Parse message
        raw_val = msg.value().decode('utf-8')
        try:
            tx = json.loads(raw_val)
            process_transaction(tx)
        except Exception as e:
            print(f"Error processing message: {e}")

if __name__ == "__main__":
    run_consumer()
