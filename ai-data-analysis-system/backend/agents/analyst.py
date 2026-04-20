import json
from core.state import AgentState

def analyst_node(state: AgentState):
    """
    Analyst Agent. Generates a comprehensive executive summary report 
    including the recommended ML model and its accuracy score.
    Uses Ollama LLM for natural language generation, with a structured fallback.
    """
    print("[AnalystAgent] Generating executive summary report...")
    metrics = state.get("model_metrics", {})
    cleaning_report = state.get("cleaning_report", "N/A")
    task = state.get("task", "Data Analysis")
    logs = state.get("logs", [])

    best_model = metrics.get("best_model_name", "Unknown")
    best_accuracy = metrics.get("best_accuracy", 0)
    task_type = metrics.get("task_type", "unknown")
    metric_name = metrics.get("metric_name", "Score")
    all_scores = metrics.get("all_model_scores", {})
    target_col = metrics.get("target_column", "Unknown")
    num_features = metrics.get("num_features", 0)
    num_samples = metrics.get("num_samples", 0)
    feature_importances = metrics.get("feature_importances", {})

    # Build a ranked model comparison string
    sorted_models = sorted(all_scores.items(), key=lambda x: x[1], reverse=True)
    model_ranking_str = "\n".join(
        f"  {i+1}. {name}: {score:.4f}" for i, (name, score) in enumerate(sorted_models)
    )

    # Top features string
    top_features = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)[:5]
    features_str = ", ".join(f"{k} ({v:.4f})" for k, v in top_features) if top_features else "N/A"

    # Try LLM-generated summary
    summary = None
    try:
        from langchain_ollama import OllamaLLM
        llm = OllamaLLM(model="llama3.2:1b")
        prompt = f"""
You are an expert data scientist writing an executive summary report.

TASK: {task}
DATASET: {num_samples} samples, {num_features} features, target column: "{target_col}"
TASK TYPE: {task_type}
DATA CLEANING: {cleaning_report}

MODEL BENCHMARKING RESULTS ({metric_name}):
{model_ranking_str}

BEST MODEL: {best_model} with {metric_name} = {best_accuracy}
TOP FEATURES: {features_str}

Write a concise, professional executive summary (200-300 words) that covers:
1. Dataset overview and preparation steps
2. The ML task type and why it was chosen
3. All models benchmarked with their scores
4. The RECOMMENDED model and its accuracy/R² score
5. Key feature insights
6. Actionable recommendations

Use clear headings and bullet points. Be specific with numbers.
"""
        summary = llm.invoke(prompt)
        print("[AnalystAgent] LLM-generated summary produced.")
    except Exception as e:
        print(f"[AnalystAgent] LLM unavailable, using structured template: {e}")

    # Fallback structured template
    if not summary:
        summary = f"""═══════════════════════════════════════════════════════
              AUTO-ML EXECUTIVE SUMMARY REPORT
═══════════════════════════════════════════════════════

📋 TASK: {task}

📊 DATASET OVERVIEW
  • Samples: {num_samples}
  • Features: {num_features}
  • Target Column: {target_col}
  • Task Type: {task_type.upper()}

🧹 DATA PREPARATION
  {cleaning_report}

🤖 MODEL BENCHMARKING ({metric_name})
{model_ranking_str}

🏆 RECOMMENDED MODEL
  ➤ {best_model}
  ➤ {metric_name}: {best_accuracy:.4f} ({best_accuracy*100:.1f}%)

📈 KEY FEATURES (by importance)
  {features_str}

💡 INSIGHTS
  • The {best_model} achieved the highest {metric_name.lower()} of {best_accuracy:.4f}
    among {len(all_scores)} models tested on this {task_type} task.
  • This model is recommended for production deployment on similar data.
  • The most influential features are: {features_str}

═══════════════════════════════════════════════════════"""

    return {
        "analysis_result": summary,
        "logs": logs + [f"AnalystAgent generated executive summary. Recommended: {best_model} ({metric_name}: {best_accuracy})"]
    }
