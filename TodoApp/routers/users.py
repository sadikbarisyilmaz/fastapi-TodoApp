from datetime import datetime, timedelta, timezone
from math import log
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from ..database import SessionLocal
from ..models import Users
from passlib.context import CryptContext
from starlette import status
from jose import jwt,JWTError
from .auth import get_current_user

class ChangePasswordRequest(BaseModel):
    current_password : str = Field(min_length=3)
    new_password : str = Field(min_length=3)
    model_config = {
        "json_schema_extra": {
            "example":  {
                "current_password": "current_password",
                "new_password": "new_password",
            }
        }
    }


SECRET_KEY = "f5e212419fa0d6f59ba4ae3ae9c7382154c914485264f62878649d766fd1b59d"
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()
db_dependency = Annotated[Session,Depends(get_db)]
user_dependency = Annotated[dict,Depends(get_current_user)]
        
router = APIRouter(
    prefix='/users',
    tags=['users']
)

bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated=["auto"])
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


@router.get("", status_code=status.HTTP_200_OK)
def get_user(user: user_dependency, db:db_dependency):
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    return db.query(Users).filter(Users.username == user.get("username")).first()

@router.put("", status_code=status.HTTP_204_NO_CONTENT)
def change_password(user: user_dependency, db:db_dependency,change_password_request:ChangePasswordRequest):

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    
    user_model = db.query(Users).filter(Users.username == user.get("username")).first()

    if user_model is None:
        raise HTTPException(status_code=404,detail="Todo not found")
    
    if not bcrypt_context.verify(change_password_request.current_password,user_model.hashed_password):
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Wrong Password')

    user_model.hashed_password = bcrypt_context.hash(change_password_request.new_password)

    db.add(user_model) # preprares to add
    db.commit() # actually adds
    
@router.put("/phone/{phone_number}", status_code=status.HTTP_204_NO_CONTENT)
def change_phone_number(user: user_dependency, db:db_dependency,phone_number:str):

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')

    user_model = db.query(Users).filter(Users.username == user.get("username")).first()

    if user_model is None:
        raise HTTPException(status_code=404,detail="Todo not found")
    
    user_model.phone_number = phone_number
    
    db.add(user_model) # preprares to add
    db.commit() # actually adds