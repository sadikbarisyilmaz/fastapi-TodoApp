from .utils import *
from ..routers.users import get_db, get_current_user
from fastapi import status

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

def test_return_user():
    response = client.get("/users")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['username'] == 'testuser'
    assert response.json()['email'] == 'mail@mail.com'
    assert response.json()['first_name'] == 'john'
    assert response.json()['last_name'] == 'doe'
    assert response.json()['role'] == 'admin'
    assert response.json()['phone_number'] == '2222222222'

def test_change_password_success():
    response = client.put("/users", json={"current_password": "newpassword",
                                                  "new_password": "newpassword"})
    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_change_password_invalid_current_password():
    response = client.put("/users", json={"current_password": "wrong_password",
                                                  "new_password": "newpassword"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Wrong Password'}


def test_change_phone_number_success():
    response = client.put("/users/phone/2222222222")
    assert response.status_code == status.HTTP_204_NO_CONTENT






