from .utils import *
from ..routers.todos import get_db, get_current_user

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

def test_read_all_todos(test_todo):
   response = client.get("/todo")
   assert response.status_code == status.HTTP_200_OK
   assert response.json() == [{
                                "title":"test title",
                                "description":"test description",
                                "priority": 5,
                                "complete": False,
                                "owner_id": 1,
                                "id":1
                                }]
   
def test_read_one_todo(test_todo):
   response = client.get("/todo/1")
   assert response.status_code == status.HTTP_200_OK
   assert response.json() == {
                                "title":"test title",
                                "description":"test description",
                                "priority": 5,
                                "complete": False,
                                "owner_id": 1,
                                "id":1
                                }
def test_create_todo(test_todo):
   todo_req = {"title":"test title 2","description":"test description 2","priority": 5,"complete": False}
   response = client.post("/todo",json=todo_req)
   assert response.status_code == 201

   db = TestingSessionLocal()
   todo_model = db.query(Todos).filter(Todos.id == 2).first()
   assert todo_model.title == todo_req.get("title")
   db.close()

def test_update_todo(test_todo):
    request_data={
        'title':'Change the title of the todo already saved!',
        'description': 'Need to learn everyday!',
        'priority': 5,
        'complete': False,
    }

    response = client.put('/todo/1', json=request_data)
    assert response.status_code == 204
    db = TestingSessionLocal()
    model = db.query(Todos).filter(Todos.id == 1).first()
    assert model.title == 'Change the title of the todo already saved!'
    db.close()


def test_update_todo_not_found(test_todo):
    request_data={
        'title':'Change the title of the todo already saved!',
        'description': 'Need to learn everyday!',
        'priority': 5,
        'complete': False,
    }

    response = client.put('/todo/999', json=request_data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found'}


def test_delete_todo(test_todo):
    response = client.delete('/todo/1')
    assert response.status_code == 204
    db = TestingSessionLocal()
    model = db.query(Todos).filter(Todos.id == 1).first()
    assert model is None
    db.close()


def test_delete_todo_not_found():
    response = client.delete('/todo/999')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found'}
