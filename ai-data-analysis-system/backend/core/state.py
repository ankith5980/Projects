from typing import TypedDict, Optional

class AgentState(TypedDict):
    task: str
    csv_file_path: Optional[str]
    masked_csv_path: Optional[str]
    masked_data_preview: Optional[str]
    analysis_result: Optional[str]
    recharts_config: Optional[dict]
    logs: list[str]
