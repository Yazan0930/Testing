import pytest
import unittest.mock as mock

from src.util.helpers import hasAttribute, ValidationHelper

# tests for the hasAttribute method
@pytest.mark.demo
@pytest.mark.parametrize('obj, expected', [({'name': 'Jane'}, True), ({'email': 'jane.doe@gmail.com'}, False), (None, False)])
def test_hasAttribute_true(obj, expected):
    assert hasAttribute(obj, 'name') == expected

# tests for the validateAge method
@pytest.fixture
def sut(age: int):
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': age}
    mockedsut = ValidationHelper(usercontroller=mockedusercontroller)
    return mockedsut

@pytest.mark.demo
@pytest.mark.parametrize('age, expected', [(-1, 'invalid'), (0, 'underaged'), (1, 'underaged'), (17, 'underaged'), (18, 'valid'), (19, 'valid'), (119, 'valid'), (120, 'valid'), (121, 'invalid')])
def test_validateAge(sut, expected):
    validationresult = sut.validateAge(userid=None)
    assert validationresult == expected
