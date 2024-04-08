from flask import Blueprint, request, jsonify, session
from services.model_data_service import create_model_data, store_model_data_in_session
from models.model_data import ModelData
from utils.database_util import send_to_database
from utils.database import get_db
from utils.model_list import model_list

#create blueprint
model_data_controller = Blueprint("model_data_controller", __name__)

#create route for accepting POST requests for creating a new modelData object abd storing it in the session
@model_data_controller.route("/modeldata", methods=["POST"])
def create_model_request():
    """
    Creates a new modelData object with the provided data and stores it in the session.

    Returns:
        JSON: The modelData object.
    """
    
    # Check if the request is json
    if not request.is_json:
        return jsonify({"error": "Invalid: content type is not json"}), 415

    # get the data from the request
    data = request.get_json()

    # validate that model_name is a non-empty string
    model_name = data.get('model_name')
    if not isinstance(model_name, str) or model_name.strip() == '':
        return jsonify({"error": "Invalid: model name is required"}), 400

    try:
        # create a new modelData object
        model_data = create_model_data(model_name)
    except Exception as e:
        # handle error if model_data creation fails
        return jsonify({"error": "An error occurred while creating model data: " + str(e)}), 500
  
    # store the modelData object in the session
    store_model_data_in_session(model_name, model_data)

    audio_file = model_data.to_dict()['audiofile']
    
    # return the audio from the modelData object in the response, audio is a byte string
    return jsonify({'audio_file': audio_file }), 201

#create route for sending the model list to the client
@model_data_controller.route("/model-list", methods=["GET"])
def get_model_list():
    """
    Sends the list of available models to the client.

    Returns:
        JSON: A list of available models.
    """
    
    return jsonify({
        "models": model_list
    })