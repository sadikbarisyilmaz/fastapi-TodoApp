from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Todos
from starlette import status
from .auth import get_current_user

class TodoRequest(BaseModel):
    title: str = Field(min_length=3)
    description:str = Field(min_length=3, max_length=100)
    priority:int = Field(gt=0, lt=6)
    complete: bool # =Field(default=False)
    model_config = {
        "json_schema_extra": {
            "example":  {
                "priority": 5,
                "complete": False,
                "title": "Feed the cat",
                "id": 4,
                "description": "She is getting hungary"
            }
        }
    }
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]
user_dependency = Annotated[dict,Depends(get_current_user)]

router = APIRouter(
    prefix='/todo',
    tags=['todo']
)


@router.get("", status_code=status.HTTP_200_OK)
def read_all(user: user_dependency,db:db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    return db.query(Todos).filter(Todos.owner_id==user.get("id")).all()

@router.get("/{todo_id}", status_code=status.HTTP_200_OK)
def read_by_id(user: user_dependency,db:db_dependency,todo_id:int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    todo_model = db.query(Todos).filter(Todos.id == todo_id ).filter(Todos.owner_id==user.get("id")).first()
    if todo_model is not None:
        return todo_model
    raise HTTPException(status_code=404,detail="Todo not found")

@router.post("", status_code=status.HTTP_201_CREATED)
def create_todo(user: user_dependency, db:db_dependency,todo_req:TodoRequest):

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    new_todo = Todos(**todo_req.model_dump(),owner_id=user.get("id"))

    db.add(new_todo) # preprares to add
    db.commit() # actually adds

@router.put("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_todo(user: user_dependency,db:db_dependency,todo_req:TodoRequest,todo_id:int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    
    todo_model = db.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id==user.get("id")).first()
    if todo_model is None:
        raise HTTPException(status_code=404,detail="Todo not found")
    
    todo_model.title = todo_req.title
    todo_model.description = todo_req.description
    todo_model.priority = todo_req.priority
    todo_model.complete = todo_req.complete

    db.add(todo_model) # preprares to add
    db.commit() # actually adds

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(user: user_dependency,db:db_dependency,todo_id:int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Authentication Failed')
    todo_model = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404,detail="Todo not found")
    
    db.query(Todos).filter(Todos.id == todo_id).delete()
    db.commit() 
  
    
    