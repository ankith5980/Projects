from pydantic import BaseModel
from typing import Optional

class ResearchRequest(BaseModel):
    query: str
    folder_path: Optional[str] = None

class ResearchResponse(BaseModel):
    task_id: str
    status: str
