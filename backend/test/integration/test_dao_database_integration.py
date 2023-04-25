from datetime import datetime
import email
import pytest
from src.util.dao import DAO
from src.util.daos import getDao
from bson import json_util
from bson.objectid import ObjectId

@pytest.fixture(scope="module")
def task():
    dao = DAO(collection_name='task')
    taskData = {'title': 'hello', 'description': '(add a description here)', 'todos': [], 'startdate': datetime(2022, 7, 2, 11, 24, 36, 467306), 'categories': [], 'video': ObjectId('62c00ed43ef84fb08f8dd096')}
    task = dao.create(taskData)
    yield task
    dao.delete(task['_id']['$oid'])

@pytest.fixture(scope="module")
def dao():
    dao = DAO(collection_name='user')
    yield dao

def test_case_1(dao, task):
    data = {'firstName': 'Jane', 'lastName': 'Doe', 'email': 'jane.doe@mail.com', 'tasks': [ObjectId(task['_id']["$oid"])]}
    user = dao.create(data)
    assert user['firstName'] == 'Jane'
    dao.delete(user['_id']['$oid'])

def test_case_2(dao):
    with pytest.raises(Exception):
        data = {'firstName': 'Jane', 'lastName': 'Doe'}
        user = dao.create(data)

def test_case_3(dao):
    with pytest.raises(Exception):
        data = {'firstName': 'Jane', 'lastName': 'Doe', 'email': {'hello': 'world'}}
        user = dao.create(data)

def test_case_4(dao, task):
    with pytest.raises(Exception):
        data = {'firstName': 'Jane', 'lastName': 'Doe', 'email': 'jane.doe@mail.com', 'tasks': [ObjectId(task['_id']["$oid"])]}
        user = dao.create(data)
        dao.delete(user['_id']['$oid'])