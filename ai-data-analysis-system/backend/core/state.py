from typing import TypedDict, Optional

class AgentState(TypedDict):
    task: str
    csv_file_path: Optional[str]
    masked_csv_path: Optional[str]
    masked_data_preview: Optional[str]
    cleaning_report: Optional[str]
    model_metrics: Optional[dict]
    target_column: Optional[str]
    best_model_name: Optional[str]
    best_accuracy: Optional[float]
    analysis_result: Optional[str]
    recharts_configs: list[dict]
    logs: list[str]
