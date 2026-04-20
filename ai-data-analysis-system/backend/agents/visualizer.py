import pandas as pd
import json
from langchain_ollama import OllamaLLM
from core.state import AgentState

def visualizer_node(state: AgentState):
    """
    The Visualizer Agent dynamically prompts Ollama to determine the ideal 
    data mapping (xKey, yKey, chart_type) based on the user's specific Task and the parsed Dataframe schema.
    It then mathematically slices the data as the LLM directed.
    """
    task = state.get("task", "")
    masked_csv = state.get("masked_csv_path")
    print("[VisualizerAgent] Algorithmic chart generation...")
    
    df = pd.read_csv(masked_csv)
    
    # Extract structural schema to show the LLM what it has to work with
    columns = df.columns.tolist()
    dtypes = {c: str(df[c].dtype) for c in columns}
    
    prompt = f"""
    You are an expert Data Visualizer. 
    The user wants to analyze this dataset based on this task: "{task}"
    
    The dataset has the following columns and types:
    {dtypes}
    
    Decide the absolute best column to use as the X-Axis (xKey) and numerical Y-Axis (yKey) to satisfy the prompt.
    Also decide the chart type ("bar_chart" or "line_chart").
    
    Return EXACTLY AND ONLY a valid JSON dictionary in this shape: 
    {{"xKey": "column_name", "yKey": "numerical_column_name", "type": "chart_type"}}
    """
    
    print("[VisualizerAgent] Calling LLM for exact variable targeting...")
    try:
        llm = OllamaLLM(model="llama3.2:1b", format="json") # Force JSON format
        llm_response = llm.invoke(prompt)
        mapping = json.loads(llm_response)
        
        xKey = mapping.get("xKey")
        yKey = mapping.get("yKey")
        chart_type = mapping.get("type", "bar_chart")
        
        # Validate keys exist
        if xKey not in columns: xKey = None
        if yKey not in columns: yKey = None
            
    except Exception as e:
        print(f"[VisualizerAgent] LLM parsing failed or unavailable, defaulting to heuristics: {e}")
        numeric_cols = df.select_dtypes(include='number').columns.tolist()
        string_cols = df.select_dtypes(include='object').columns.tolist()
        xKey = string_cols[0] if string_cols else None
        yKey = numeric_cols[0] if numeric_cols else None
        chart_type = "bar_chart"
        
    # Safeguard if keys completely failed
    if not yKey:
        yKey = "index"
        chart_type = "line_chart"
        
    # Process the exact dimensions the LLM requested
    # Sample up to 15 rows for neat visualization, or group if categorical
    if xKey and yKey and str(df[xKey].dtype) == 'object':
        try:
             viz_df = df.groupby(xKey, as_index=False)[yKey].sum().head(15)
        except Exception:
             viz_df = df.head(15)
    else:
        viz_df = df.head(15)
        
    # We must reset index so that "index" gets explicitly converted to a column 
    # that Recharts can read if there is no valid categorical xKey.
    if not xKey:
        viz_df = viz_df.reset_index()
        xKey = "index"
            
    data = viz_df.to_dict(orient="records")

    recharts_config = {
        "type": chart_type,
        "title": "LLM Generated Graph",
        "data": data,
        "xKey": xKey,
        "yKey": yKey
    }
    
    current_logs = state.get("logs", [])
    if current_logs is None:
        current_logs = []
        
    return {
        "recharts_config": recharts_config,
        "logs": current_logs + ["VisualizerAgent synced LLM contextual logic to graph mapping."]
    }
