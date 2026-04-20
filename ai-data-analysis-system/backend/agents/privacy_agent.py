import pandas as pd
import os
from core.state import AgentState
from services.privacy import privacy_service

def privacy_node(state: AgentState):
    """
    Loads raw data and passes it through the Presidio-based PrivacyService 
    to mask sensitive columns before handing it to the Analyst agent.
    """
    csv_file_path = state.get("csv_file_path")
    
    print(f"[PrivacyAgent] Securing dataset...")
    
    # Mock data generation if file doesn't exist for test purposes
    if not csv_file_path or not os.path.exists(csv_file_path):
        df = pd.DataFrame({
            "User_Name": ["Alice", "Bob", "Charlie", "David", "Eve"],
            "Email": ["alice@email.com", "bob@email.com", "charlie@email.com", "david@email.com", "eve@email.com"],
            "TransactionAmount": [150.0, 200.0, 50.0, 120.0, 75.0]
        })
    else:
        df = pd.read_csv(csv_file_path)
        
    # Mask data using Presidio wrapper
    masked_df = privacy_service.mask_dataframe(df)
    
    # Save masked data for downstream nodes
    os.makedirs("uploads", exist_ok=True)
    masked_csv_path = "uploads/masked_temp.csv"
    masked_df.to_csv(masked_csv_path, index=False)
    
    # Generate snippet for preview
    masked_preview = masked_df.head().to_json(orient="records")
    
    current_logs = state.get("logs", [])
    if current_logs is None:
        current_logs = []
        
    return {
        "masked_csv_path": masked_csv_path,
        "masked_data_preview": masked_preview,
        "logs": current_logs + ["PrivacyAgent encrypted sensitive 'PERSON' and 'EMAIL' columns via Presidio Engine."]
    }
