# routes/heroRoutes.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy.orm import Session
from typing import Annotated
from ..models.userModel import User
from ..database import get_session

authRouter = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@authRouter.post("/users/")
def create_user(user: User, session: SessionDep) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@authRouter.get("/users/")
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[User]:
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users
