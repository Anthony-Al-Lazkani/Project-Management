from sqlmodel import Field, SQLModel
from typing import Optional
from enum import Enum
from datetime import date

class ProjectStatus(str, Enum):
    not_started = "Not Started"
    in_progress = "In Progress"
    completed = "Completed"
    on_hold = "On Hold"

class Project(SQLModel, table=True):
    id: int= Field(default=None, primary_key=True)
    name: str = Field(..., max_length=100, description="Name of the project")
    description: Optional[str] = Field(default=None, description="Description of the project")
    owner_id: int = Field(foreign_key="user.id", description="ID of the project owner")
    status: ProjectStatus = Field(default=ProjectStatus.not_started, description="Status of the project")
    start_date: date = Field(default=None, description="Start date of the project")
    end_date: date = Field(default=None, description="End date of the project")
    created_at: date = Field(default_factory=date.today, description="Timestamp of project creation")
    updated_at: date = Field(default_factory=date.today, description="Timestamp of last update")
