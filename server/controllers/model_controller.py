from services.model_service import get_model, receive_model
from flask import Blueprint
from utils.tag_list import tag_list

model_controller = Blueprint('model_controller', __name__)

@model_controller.route('/get-model-data', methods=['GET'])
def get_model_data():

    return get_model()

@model_controller.route('/receive-model-data/<model>', methods=['POST'])
def receive_model_data(model):
    
    return receive_model(model)

@model_controller.route('/tag-list', methods=['GET'])
def get_tag_list():
    
    return tag_list