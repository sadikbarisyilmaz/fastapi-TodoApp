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

SECRET_KEY  =   "f5e212419fa0d6f59ba4ae3ae9c7382154c914485264f62878649d766fd1b59d"
ALGORITHM = "HS256"
class CreateUserRequest(BaseModel):
  
    email: str = Field(min_length=3)
    username:str = Field(min_length=3, max_length=100)
    first_name: str = Field(min_length=3)
    last_name: str = Field(min_length=3)
    password: str = Field(min_length=3)
    role:str = Field(min_length=0)
    phone_number:str = Field(min_length=3)
    model_config = {
        "json_schema_extra": {
            "example":  {
                "email": "mail@mail.com",
                "username":"johndoe",
                "first_name": "john",
                "last_name": "doe",
                "role": "admin",
                "password": "1234",
                "ph0ne_number": "02322323232"
            }
        }
    }

class Token(BaseModel):
    access_token:str
    token_type:str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()
db_dependency = Annotated[Session,Depends(get_db)]
        
router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated=["auto"])
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user
def create_access_token(username:str,user_id:int, role:str, expires_delta:timedelta):
    encode = {"sub": username, "id": user_id,"role":role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp":expires})
    return jwt.encode(encode,SECRET_KEY,algorithm=ALGORITHM)
def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_role: str = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
        return {'username': username, 'id': user_id, 'role': user_role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')



#####Routes#####
@router.get("", status_code=status.HTTP_200_OK)
def read_all_users(db:db_dependency):
    return db.query(Users).all()

@router.post("",status_code=status.HTTP_201_CREATED)
def create_user (db:db_dependency ,create_user_request:CreateUserRequest):

    create_user_model=Users(
        email = create_user_request.email,
        username = create_user_request.username,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        hashed_password = bcrypt_context.hash(create_user_request.password),
        role = create_user_request.role,
        is_active= True,
        phone_number = create_user_request.phone_number
    )

    db.add(create_user_model) # preprares to add
    db.commit() # actually adds

@router.post("/token",response_model=Token)
def login_for_access_token(form_data:Annotated[OAuth2PasswordRequestForm,Depends()],db:db_dependency):

    user = authenticate_user(form_data.username,form_data.password,db)
    if not user:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')

    token = create_access_token(user.username, user.id, user.role,timedelta(minutes=20))


    return  {"access_token":token,"token_type":"bearer"}

@router.post("/login")
def login_for_user(form_data:Annotated[OAuth2PasswordRequestForm,Depends()],db:db_dependency):

    user = authenticate_user(form_data.username,form_data.password,db)
    if not user:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
    user.hashed_password=""
    return  user

