from sqlalchemy import create_engine,text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from fastapi.testclient  import TestClient
from ..main import app
from fastapi import status
import pytest
from ..models import Todos, Users
from ..routers.auth import bcrypt_context



SQLALCHEMY_DATABASE_URL = "postgresql://postgres:ibanthee@localhost/TodoApplicationDatabase_Test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()
client = TestClient(app)
bcrypt_context


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally: 
        db.close()

def override_get_current_user():
    return {"username":"testuser","role":"admin","id":1}

@pytest.fixture
def test_todo():
    todo = Todos(
        title="test title",
        description="test description",
        priority= 5,
        complete= False,
        owner_id= 1
    )
    db = TestingSessionLocal()
    db.add(todo)
    db.commit()
    yield todo
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM todos;"))
        connection.execute(text("TRUNCATE TABLE todos RESTART IDENTITY;"))
        connection.commit()

@pytest.fixture
def test_user():
    user = Users(
        username="codingwithrobytest",
        email="codingwithrobytest@email.com",
        first_name="Eric",
        last_name="Roby",
        hashed_password=bcrypt_context.hash("testpassword"),
        role="admin",
        phone_number="(111)-111-1111",
        id=2
    )
    db = TestingSessionLocal()
    db.add(user)
    db.commit()
    yield user
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM users WHERE username='codingwithrobytest';"))
        connection.commit()

