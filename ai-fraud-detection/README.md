# Real-Time AI Fraud Detection Engine

An end-to-end Machine Learning streaming architecture designed to instantly detect, score, and flag fraudulent financial transactions in real-time. This system utilizes a decoupled microservice architecture merging high-throughput message brokering (Kafka), in-memory velocity tracking (Redis), asynchronous REST/WebSockets (FastAPI), unsupervised Anomaly Detection (Scikit-Learn), and a highly modern glassmorphic dashboard (Next.js).

## Intended Results & Features

- **Sub-Second Anomaly Detection**: Analyze transactions the moment they are generated without relying on slow, third-party external APIs.
- **Dynamic Risk Velocity**: Measure exactly how fast users are transacting over a 10-minute sliding window using highly optimized Redis Sorted Sets. 
- **Premium Visualization**: A sleek, dark-mode Next.js UI leveraging Framer Motion and custom glassmorphism. Transactions flow into a live ledger, update a real-time line distribution chart, and instantly trigger glowing red critical alerts on the sidebar when an anomaly is isolated.
- **Unsupervised Learning**: An offline-trained Isolation Forest model detects mathematical outliers (e.g., abnormally high transaction volumes or sudden spikes in transaction frequency) without needing labeled "fraud" vs. "clean" datasets.

---

## How It Works (The Architecture)

```mermaid
graph TD
    A[Kafka Producer (Python)] -->|Push Transaction Stream| B(Kafka Broker 'transactions' Topic)
    B --> C[Kafka Consumer (Python)]
    
    C -->|Calculate 10m Velocity| D[(Redis)]
    D -->|Return count/score| C
    
    C -->|Feed Amount & Velocity features| E((Isolation Forest Model))
    E -.->|Inference Result| C
    
    C -->|Push if Fraud| F(Redis Pub/Sub 'fraud_alerts_channel')
    C -->|Store Recent State| D
    
    F --> G[FastAPI WebSocket]
    D --> M[FastAPI REST /api/recent]

    G -->|Stream Actionable Alerts| H[Next.js Real-Time Dashboard]
    M -->|Hydrate Initial Load| H
```

1. **Ingestion**: `producer.py` simulates a bustling financial network, injecting synthetic transactions (using normal and fraudulent Gaussian distributions) into a local Kafka cluster.
2. **Stateful Streaming**: `consumer.py` ingests the stream. Before scoring, it passes the `user_id` to Redis to grab the user's "velocity" (number of transactions in the last 10 minutes).
3. **Machine Learning Evaluation**: The transaction amount and the user's velocity are passed natively into the loaded Scikit-Learn Isolation Forest `.pkl` model.
4. **Instant Action**: If the prediction equals `-1` (an outlier), the consumer immediately pushes the transaction details payload onto a Redis Pub/Sub channel. 
5. **Real-Time Client Updates**: A FastAPI server holds an active WebSocket connection with the frontend browser. The moment Redis receives a publish event, FastAPI streams it directly to the UI, bypassing traditional database `SELECT` latency entirely.

---

## Local Setup & Installation

### Requirements
- **Docker Desktop** (For running Kafka and Redis images)
- **Node.js** (v18+)
- **Python** (v3.10+)

### 1. Start the Core Infrastructure
Ensure Docker is running, then spin up the backend dependencies:
```bash
docker-compose up -d
```
*This will pull and run confluent-kafka, zookeeper, and redis alpine images.*

### 2. Setup the Python Environment
Install backend dependencies and train the initial ML model:
```bash
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r backend/requirements.txt

# Generate the synthetic dataset & pickle the Isolation Forest model
python backend/ml/train_model.py
```

### 3. Setup the Next.js Frontend
```bash
cd frontend
npm install
```

### 4. Run the Engine!
To see the system run seamlessly, you need to start the remaining 4 services concurrently (in separate terminals or via `start_all.ps1` if on Windows):

1. **Start the API:** `python backend/main.py`
2. **Start the Consumer Pipeline:** `python backend/streaming/consumer.py`
3. **Start the Producer (Data Generator):** `python backend/streaming/producer.py`
4. **Start the Dashboard:** `npm run dev` (Inside the `frontend` folder)

Open [http://localhost:3000](http://localhost:3000) and watch the Real-Time AI Vanguard handle active threats!
