import json
import time
import random
import uuid
from confluent_kafka import Producer
from datetime import datetime

KAFKA_BROKER = 'localhost:9092'
TOPIC = 'transactions'

# Initialize Kafka Producer
conf = {'bootstrap.servers': KAFKA_BROKER}
producer = Producer(**conf)

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result """
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        # Avoid spamming console for every msg, but uncomment for debug
        # print(f"Message delivered to {msg.topic()} [{msg.partition()}]")
        pass

def generate_transaction():
    # Randomly introduce "fraud-like" spikes
    is_fraud_spike = random.random() < 0.05
    
    if is_fraud_spike:
        amount = round(random.gauss(5000, 1000), 2)
    else:
        amount = round(random.gauss(50, 30), 2)
        
    amount = max(amount, 1.0)
    
    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": f"user_{random.randint(1, 1000)}",
        "amount": amount,
        "timestamp": datetime.utcnow().isoformat(),
        "merchant": random.choice(["AMAZON", "STARBUCKS", "WALMART", "APPLE", "UBER", "UNKNOWN_CRYPTO_EXCHANGE"]),
        "location": random.choice(["NY", "CA", "TX", "INTL"])
    }

def run_producer():
    print(f"Starting transaction producer... publishing to '{TOPIC}'")
    while True:
        try:
            tx = generate_transaction()
            producer.produce(
                topic=TOPIC,
                key=tx["user_id"].encode('utf-8'),
                value=json.dumps(tx).encode('utf-8'),
                callback=delivery_report
            )
            producer.poll(0) # trigger callbacks
            
            # Simulate real-time stream with variable delays
            time.sleep(random.uniform(0.1, 0.5))
        except KeyboardInterrupt:
            break
            
    print("Flushing records...")
    producer.flush()

if __name__ == "__main__":
    run_producer()
