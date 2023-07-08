import pytest
from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock

"""Given a valid email address of an existing account, return the user object contained in the database associated 
		to that user. For now, do not assume that the email attribute is unique. Output an error message containing the email
		address if the search returns multiple users.
		
		parameters:
				email -- an email address string 

		returns:
				user -- the user object associated to that email address (if multiple users are associated to that email: return the first one)
				None -- if no user is associated to that email address

		raises:
				ValueError -- in case the email parameter is not valid (i.e., conforming <local-part>@<domain>.<host>)
				Exception -- in case any database operation fails
    
    
    1. email is not valid
    2. email is valid but there is no user wiht the email
    3. email is valid + 1 user with associate email return user
    4. email is valid + more then 1 user then return first user
		"""

@pytest.fixture
def dao_mock():
    dao = MagicMock()
    yield dao

@pytest.fixture
def controller(dao_mock):
    controller = UserController(dao_mock)
    yield controller

@pytest.mark.unit
class TestUserController:
    def test_get_user_by_email_success(self, dao_mock, controller):
        dao_mock.find.return_value = [{'email': 'test@example.com', 'name': 'Test User'}]
        
        user = controller.get_user_by_email('test@example.com')
        
        dao_mock.find.assert_called_once_with({'email': 'test@example.com'})
        assert user == {'email': 'test@example.com', 'name': 'Test User'}
        
    def test_get_user_by_email_invalid_email(self, dao_mock, controller):
        with pytest.raises(ValueError):
            controller.get_user_by_email('invalid_email')
            
        dao_mock.find.assert_not_called()
        
    def test_get_user_by_email_no_user_found(self, dao_mock, controller):
        dao_mock.find.return_value = []
        
        user = controller.get_user_by_email('nonexistent@example.com')
        
        dao_mock.find.assert_called_once_with({'email': 'nonexistent@example.com'})
        assert user == None
        
    def test_get_user_by_email_multiple_users_found(self, dao_mock, controller):
        dao_mock.find.return_value = [{'email': 'test@example.com', 'name': 'Test User 1'}, {'email': 'test@example.com', 'name': 'Test User 2'}]
        
        user = controller.get_user_by_email('test@example.com')

        dao_mock.find.assert_called_once_with({'email': 'test@example.com'})
        assert user == {'email': 'test@example.com', 'name': 'Test User 1'}