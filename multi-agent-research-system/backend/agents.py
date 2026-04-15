from typing import TypedDict, Optional, List, Any
from langgraph.graph import StateGraph, END
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from faiss_loader import get_retriever

class GraphState(TypedDict):
    task_id: str
    query: str
    plan: Optional[str]
    research_data: Optional[str]
    report: Optional[str]
    status_updates: List[str]

# Define LLM. Using llama3.2 (3B) — optimized for RTX 3050 (4GB VRAM)
llm = OllamaLLM(model="llama3.2", temperature=0, num_predict=1024)

def node_planner(state: GraphState):
    query = state["query"]
    prompt = PromptTemplate.from_template(
        "You are an expert research planner. Given the user query, write a short, concise 3-step research plan.\n\nQuery: {query}\n\nPlan:"
    )
    plan = (prompt | llm).invoke({"query": query})
    updates = state.get("status_updates", []) + ["Planner: Deconstructed the query and created a research plan."]
    return {"plan": plan, "status_updates": updates}

def node_researcher(state: GraphState):
    query = state["query"]
    retriever = get_retriever()
    
    if retriever:
        docs = retriever.invoke(query)
        research_data = "\n\n".join([f"Source snippet: {d.page_content}" for d in docs])
        updates = state.get("status_updates", []) + [f"Researcher: Retrieved {len(docs)} relevant document chunks from the database."]
    else:
        research_data = "No specific internal documents were found. Relying on general knowledge."
        updates = state.get("status_updates", []) + ["Researcher: No database configured. Fallback to general LLM knowledge."]
        
    return {"research_data": research_data, "status_updates": updates}

def node_writer(state: GraphState):
    query = state["query"]
    plan = state["plan"]
    research_data = state["research_data"]
    
    prompt = PromptTemplate.from_template(
        "You are an expert analyst. Write a formatted, structured markdown report responding to the user query.\n\n"
        "User Query: {query}\n\n"
        "Planner's Outline:\n{plan}\n\n"
        "Fact Sheet (Retrieved Data):\n{data}\n\n"
        "Output ONLY the final highly-detailed markdown report. Ensure it is aesthetically formatted with headings, bullet points, and paragraphs.\n"
        "IMPORTANT: When presenting data workflows, hierarchies, or complex relationships, you MUST include mermaid.js diagrams inside ```mermaid code blocks.\n"
        "Ensure the mermaid syntax is STRICTLY valid (e.g. use standard 'graph TD' and avoid mixing syntax).\n"
    )
    report = (prompt | llm).invoke({"query": query, "plan": plan, "data": research_data})
    
    updates = state.get("status_updates", []) + ["Writer: Synthesized findings and crafted the final markdown report."]
    return {"report": report, "status_updates": updates}

workflow = StateGraph(GraphState)
workflow.add_node("planner", node_planner)
workflow.add_node("researcher", node_researcher)
workflow.add_node("writer", node_writer)

workflow.set_entry_point("planner")
workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)

research_graph = workflow.compile()
