import pandas as pd
from langchain_ollama import OllamaLLM
from core.state import AgentState

def analyst_node(state: AgentState):
    """
    The Analyst LLM natively crunches the pandas dataframe and then feeds 
    its structural mathematics to Ollama for an insightful natural language conclusion.
    """
    task = state.get("task")
    masked_csv = state.get("masked_csv_path")
    
    print("[AnalystAgent] Analyzing dataset...")
    
    df = pd.read_csv(masked_csv)
    
    # Pre-compute rigid statistical metrics for the LLM
    try:
        numeric_desc = df.describe().to_string()
    except:
        numeric_desc = "No numeric columns found."
    
    missing_vals = df.isna().sum().to_string()
    
    prompt = f"""You are an elite AI Data Analyst. Evaluate this dataset.
User Task: "{task}"

Dataset Statistical Mathematics:
{numeric_desc}

Missing Values:
{missing_vals}

Formulate a concise, highly-detailed conclusion. Synthesize the metrics, identify data flaws or patterns, and address the User Task. Format elegantly using Markdown."""

    print("[AnalystAgent] Invoking Local Llama3.2 (1B) Model...")
    try:
        llm = OllamaLLM(model="llama3.2:1b")
        analysis_result = llm.invoke(prompt)
    except Exception as e:
        # Fallback if Ollama is not actually running on port 11434
        print(f"[AnalystAgent] Ollama connection failed. Falling back to native pandas eval. {e}")
        analysis_result = f"**Local LLM Unreachable (Is Ollama running?).**\n\n**Native Statistical Fallback:**\n```\n{numeric_desc}\n```\n**Missing Values:**\n```\n{missing_vals}\n```"
    
    current_logs = state.get("logs", [])
    if current_logs is None:
        current_logs = []
        
    return {
        "analysis_result": analysis_result,
        "logs": current_logs + ["AnalystAgent evaluated stats and generated comprehensive conclusion via Ollama."]
    }
