import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from core.state import AgentState

def cleaner_node(state: AgentState):
    """
    Automated Data Cleaning Agent. Handles NaNs and encoders structurally.
    """
    print("[CleanerAgent] Executing automated data cleaning...")
    masked_csv = state.get("masked_csv_path")
    logs = state.get("logs", [])
    
    if not masked_csv:
        return {"logs": logs + ["CleanerAgent found no data."]}
        
    df = pd.read_csv(masked_csv)
    original_shape = df.shape
    
    # 1. Impute NaNs
    numeric_cols = df.select_dtypes(include='number').columns
    string_cols = df.select_dtypes(exclude='number').columns
    
    if not numeric_cols.empty:
        num_imputer = SimpleImputer(strategy='median')
        df[numeric_cols] = num_imputer.fit_transform(df[numeric_cols])
        
    if not string_cols.empty:
        str_imputer = SimpleImputer(strategy='most_frequent')
        df[string_cols] = str_imputer.fit_transform(df[string_cols])
        
    # 2. Encode Categoricals (Limit to low cardinality to preserve matrix)
    encoders_used = []
    for col in string_cols:
        if df[col].nunique() < 20: # simple threshold for categoricals
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders_used.append(col)
            
    # Overwrite secure proxy proxy file with cleaned matrix
    df.to_csv(masked_csv, index=False)
    
    report = f"Data cleaned. Original shape: {original_shape}. Imputed NaNs (Median/Mode). Encoded Categoricals: {encoders_used}"
    
    return {
        "cleaning_report": report,
        "logs": logs + [f"CleanerAgent structured dataset via Scikit-Learn Imputation/Encoding."]
    }
