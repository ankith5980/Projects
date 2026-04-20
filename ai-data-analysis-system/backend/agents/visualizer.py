import pandas as pd
import json
from langchain_ollama import OllamaLLM
from core.state import AgentState

def visualizer_node(state: AgentState):
    """
    The Visualizer Agent dynamically prompts Ollama to determine the ideal 
    data mapping for the primary EDA chart, and constructs 2 additional 
    charts based on the Auto-ML Modeler bounds (Importances & Regression diffs).
    """
    task = state.get("task", "")
    masked_csv = state.get("masked_csv_path")
    metrics = state.get("model_metrics", {})
    logs = state.get("logs", [])
    
    print("[VisualizerAgent] Generating Array of AutoML Configurations...")
    df = pd.read_csv(masked_csv)
    columns = df.columns.tolist()
    
    configs = []
    
    # ---------------------------------------------
    # Chart 1: Contextual EDA Plot (LLM Selected)
    # ---------------------------------------------
    try:
        llm = OllamaLLM(model="llama3.2:1b", format="json")
        prompt = f"""
        Task: "{task}"
        Columns: {columns}
        Determine the best X-Axis (xKey) and Y-Axis (yKey) columns for a primary EDA plot.
        Return EXACTLY JSON: {{"xKey": "col", "yKey": "col", "type": "bar_chart"}}
        """
        mapping = json.loads(llm.invoke(prompt))
        xKey = mapping.get("xKey")
        yKey = mapping.get("yKey")
        chart_type = mapping.get("type", "bar_chart")
        if xKey not in columns: xKey = columns[0]
        if yKey not in columns: yKey = columns[1] if len(columns) > 1 else columns[0]
    except Exception:
        xKey = columns[0]
        yKey = columns[1] if len(columns) > 1 else columns[0]
        chart_type = "bar_chart"
        
    viz_df = df.head(15).copy()
    configs.append({
        "type": chart_type,
        "title": f"Exploratory Distribution: {yKey} vs {xKey}",
        "data": viz_df.to_dict(orient="records"),
        "xKey": xKey,
        "yKey": yKey
    })

    # ---------------------------------------------
    # Chart 2: Feature Importances Top-N
    # ---------------------------------------------
    importances = metrics.get("feature_importances", {})
    if importances:
        imp_data = [{"feature": k, "weight": float(v)} for k, v in importances.items()]
        imp_data = sorted(imp_data, key=lambda x: x["weight"], reverse=True)[:10]
        configs.append({
            "type": "bar_chart",
            "title": "Machine Learning Feature Importance",
            "data": imp_data,
            "xKey": "feature",
            "yKey": "weight"
        })
        
    # ---------------------------------------------
    # Chart 3: Predictions / General Trend Overfitting
    # ---------------------------------------------
    test_plot = metrics.get("test_plot", {})
    if test_plot:
        predicted = test_plot.get("predicted", [])
        avp_data = [{"sample": str(i), "predicted_value": float(pred)} for i, pred in enumerate(predicted)]
        configs.append({
            "type": "line_chart",
            "title": "Predictive Testing Trend bounds",
            "data": avp_data,
            "xKey": "sample",
            "yKey": "predicted_value"
        })

    return {
        "recharts_configs": configs,
        "logs": logs + [f"VisualizerAgent assembled {len(configs)} complex ML Visualizations."]
    }
