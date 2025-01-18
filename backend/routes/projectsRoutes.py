from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from sqlmodel import Session, SQLModel, select
from sqlalchemy.orm import Session
from typing import Annotated
from ..database import get_session
from pydantic import BaseModel
from datetime import date
from ..jwt import decode_token
from ..models.projectModel import Project, ProjectStatus
from fastapi.encoders import jsonable_encoder


projectsRouter = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

class createProjectRequest(BaseModel):
    project_name : str
    description : str
    start_date : date
    end_date : date

# CREATE project
@projectsRouter.post("/projects")
async def create_project(project : createProjectRequest,request : Request,  session : SessionDep):

    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    token = authorization_header.split(" ")[1] if " " in authorization_header else authorization_header
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token["id"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if len(project.project_name) < 3 or len(project.project_name) > 30:
        raise HTTPException(status_code=400, detail="Project name must be between 3 and 30 characters")

    if len(project.description) > 500:
        raise HTTPException(status_code=400, detail="Description cannot be more than 500 characters")

    if project.start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")

    if project.end_date < project.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be earlier than the start date")

    new_project = Project(
        name=project.project_name,
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date,
        owner_id=user_id
    )


    session.add(new_project)
    session.commit()
    session.refresh(new_project)


    serialized_project = jsonable_encoder(new_project)

    return JSONResponse(
        content={"message" : "Project created successfully", "project" : serialized_project},
        status_code = 201
    )

    
    
# UPDATE project
@projectsRouter.put("/projects/{project_id}")
async def update_project(
    project_id: int,
    project: createProjectRequest,
    request: Request,
    session: SessionDep
):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    token = authorization_header.split(" ")[1] if " " in authorization_header else authorization_header
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token["id"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    project_to_update = session.exec(select(Project).where(Project.id == project_id)).first()
    
    if not project_to_update:
        raise HTTPException(status_code=404, detail="Project not found")

    if project_to_update.owner_id != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own projects")
    
    if len(project.project_name) < 3 or len(project.project_name) > 30:
        raise HTTPException(status_code=400, detail="Project name must be between 3 and 30 characters")

    if len(project.description) > 500:
        raise HTTPException(status_code=400, detail="Description cannot be more than 500 characters")

    if project.start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")

    if project.end_date < project.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be earlier than the start date")

    project_to_update.name = project.project_name
    project_to_update.description = project.description
    project_to_update.start_date = project.start_date
    project_to_update.end_date = project.end_date
    project_to_update.updated_at = date.today()

    session.commit()
    session.refresh(project_to_update)

    return JSONResponse(
        content={"message": "Project updated successfully"},
        status_code=200
    )

# GET all projects
@projectsRouter.get("/projects", response_model=list[Project])
async def get_all_projects(request: Request, session: SessionDep):

    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    token = authorization_header.split(" ")[1] if " " in authorization_header else authorization_header
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token["id"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    projects = session.exec(select(Project).where(Project.owner_id == user_id)).all()

    if not projects:
        raise HTTPException(status_code=404, detail="No projects found for this user")
    
    return projects


# DELETE project
@projectsRouter.delete("/projects/{project_id}")
async def delete_project(project_id: int, request: Request, session: SessionDep):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    token = authorization_header.split(" ")[1] if " " in authorization_header else authorization_header
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token["id"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    project_to_delete = session.exec(select(Project).where(Project.id == project_id)).first()

    if not project_to_delete:
        raise HTTPException(status_code=404, detail="Project not found")

    if project_to_delete.owner_id != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own projects")
    
    session.delete(project_to_delete)
    session.commit()

    return JSONResponse(
        content={"message": f"Project with ID {project_id} has been deleted successfully."},
        status_code=200
    )


# GET single project
@projectsRouter.get("/projects/{project_id}", response_model=Project)
async def get_single_project(project_id: int, request: Request, session: SessionDep):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    token = authorization_header.split(" ")[1] if " " in authorization_header else authorization_header
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token["id"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    project = session.exec(select(Project).where(Project.id == project_id)).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id != user_id:
        raise HTTPException(status_code=403, detail="You can only view your own projects")
    
    return project
