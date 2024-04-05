from services.model_service import get_model
from flask import Blueprint

model_controller = Blueprint('model_controller', __name__)

@model_controller.route('/get_modelData', methods=['GET'])
def get_modelData():

    return get_model()