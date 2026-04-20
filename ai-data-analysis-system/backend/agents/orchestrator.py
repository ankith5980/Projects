from core.state import AgentState

def orchestrator_node(state: AgentState):
    """
    Decides how to process the user's task.
    In a full LLM scenario, this parses the natural language to identify the target dataset and goal.
    """
    task = state.get("task", "")
    print(f"[Orchestrator] Received Task: {task}")
    
    # Use user provided dataset, or default to mock
    csv_file_path = state.get("csv_file_path")
    if not csv_file_path:
        csv_file_path = "mock_data.csv" 
    
    current_logs = state.get("logs", [])
    if current_logs is None:
        current_logs = []
        
    return {
        "csv_file_path": csv_file_path,
        "logs": current_logs + ["Orchestrator identified task and located dataset."]
    }
