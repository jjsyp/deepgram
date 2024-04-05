from services.model_service import get_model
from flask import Blueprint

model_controller = Blueprint('model_controller', __name__)

@model_controller.route('/get-model-data', methods=['GET'])
def get_model_data():

    return get_model()