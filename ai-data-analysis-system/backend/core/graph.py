import asyncio
from typing import TypedDict, Optional, AsyncGenerator
from langgraph.graph import StateGraph, END

from core.state import AgentState

# Import agent nodes
from agents.orchestrator import orchestrator_node
from agents.privacy_agent import privacy_node
from agents.analyst import analyst_node
from agents.visualizer import visualizer_node

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("Orchestrator", orchestrator_node)
workflow.add_node("PrivacyAgent", privacy_node)
workflow.add_node("AnalystAgent", analyst_node)
workflow.add_node("VisualizerAgent", visualizer_node)

# Define edges
workflow.set_entry_point("Orchestrator")
workflow.add_edge("Orchestrator", "PrivacyAgent")
workflow.add_edge("PrivacyAgent", "AnalystAgent")
workflow.add_edge("AnalystAgent", "VisualizerAgent")
workflow.add_edge("VisualizerAgent", END)

# Compile
app = workflow.compile()

async def run_analysis_stream(task: str, csv_file_path: str = None) -> AsyncGenerator[dict, None]:
    """
    Runs the compiled LangGraph and yields streaming status dicts for the frontend WebSocket.
    """
    state: AgentState = {
        "task": task,
        "csv_file_path": csv_file_path,
        "masked_data_preview": None,
        "analysis_result": None,
        "recharts_config": None,
        "logs": []
    }
    
    # Run the graph asynchronously and stream the state updates
    async for output in app.astream(state):
        node_name = list(output.keys())[0]
        
        # Yield the current processing status
        yield {
            "type": "agent_state",
            "agent": node_name,
            "status": "processing",
        }
        
        # Simulate processing delay to allow the frontend "thinking" UI state to be readable
        await asyncio.sleep(1)
        
        # Yield specific artifacts when specific agents complete
        if node_name == "AnalystAgent":
            yield {
                "type": "conclusion",
                "text": output[node_name].get("analysis_result", "")
            }
            
        if node_name == "VisualizerAgent":
            yield {
                "type": "visualization",
                "config": output[node_name].get("recharts_config", {})
            }
