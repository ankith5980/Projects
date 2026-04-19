import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    
    # Normal transactions
    normal_amounts = np.random.normal(loc=50, scale=30, size=int(num_samples * 0.95))
    normal_velocities = np.random.poisson(lam=2, size=int(num_samples * 0.95)) # Transactions in last 10 mins
    
    # Anomalous transactions (Fraud)
    fraud_amounts = np.random.normal(loc=5000, scale=1000, size=int(num_samples * 0.05))
    fraud_velocities = np.random.poisson(lam=15, size=int(num_samples * 0.05))
    
    amounts = np.concatenate([normal_amounts, fraud_amounts])
    velocities = np.concatenate([normal_velocities, fraud_velocities])
    
    df = pd.DataFrame({
        'amount': amounts,
        'velocity': velocities
    })
    
    # Make sure amount is non-negative
    df['amount'] = df['amount'].apply(lambda x: max(val for val in [x, 1.0]))
    
    # Shuffle
    df = df.sample(frac=1).reset_index(drop=True)
    return df

def train_and_save_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data()
    X = df[['amount', 'velocity']]
    
    print("Training Isolation Forest model...")
    # contamination is the expected proportion of outliers (fraud)
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(X)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    
    model_path = os.path.join(os.path.dirname(__file__), 'isolation_forest.pkl')
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("Training complete.")

if __name__ == "__main__":
    train_and_save_model()
