# routes/heroRoutes.py
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy.orm import Session
from typing import Annotated
from ..models.userModel import User
from ..database import get_session
from pydantic import BaseModel, Field, EmailStr, validator
from passlib.context import CryptContext

authRouter = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class signUpRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

class signInRequest(BaseModel):
    username : str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)


@authRouter.post("/register/")
async def sign_up(user: signUpRequest, session: SessionDep) -> JSONResponse:
    exisiting_username = session.exec(select(User).where(User.username == user.username)).first()
    if exisiting_username :
        raise HTTPException(status_code=400, detail="Username already Taken !")

    existing_email = session.exec(select(User).where(User.email == user.email)).first()
    if existing_email :
        raise HTTPException(status_code=400, detail="Email already registered !")

    if user.password != user.confirm_password :
        raise HTTPException(status_code=400, detail = "Passwords do not match !")

    hashed_password = pwd_context.hash(user.password)
    new_user = User(username = user.username, email = user.email, password = hashed_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return JSONResponse(
        content={"message" : "User created successfully"},
        status_code=201
    )


@authRouter.post("/login")
async def login(user : signInRequest, session : SessionDep) -> JSONResponse:
    existing_username = session.exec(select(User).where(User.username == user.username)).first()
    if not existing_username:
        raise HTTPException(status_code=404, detail="Username not found !")
    
    if not pwd_context.verify(user.password, existing_username.password):
        raise HTTPException(status_code=400, detail="Invalid Password !")
    return JSONResponse(
        content={"message" : "Login successful"},
        status_code = 200
    )

    

    
@authRouter.get("/users/")
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[User]:
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users
