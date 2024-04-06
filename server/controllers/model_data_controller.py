from flask import Blueprint, request, jsonify
from services.model_data_service import model_data_from_dict, model_data_to_dict, create_model_data, store_model_data_in_session

#create blueprint
model_data_controller = Blueprint("model_data_controller", __name__)

#create route for accepting POST requests for creating a new modelData object abd storing it in the session
@model_data_controller.route("/modeldata", methods=["POST"])
def create_model_data():
    """
    Creates a new modelData object with the provided data and stores it in the session.

    Returns:
        JSON: The modelData object.
    """
    
    #get the data from the request
    data = request.get_json()
    
    #create a new modelData object
    model_name = data['model_name']
    
    if not model_name:
        return {"error": "Model name is required."}, 400
    
    #create a new modelData object
    model_data = create_model_data(model_name)
    
    #store the modelData object in the session
    store_model_data_in_session(model_name, model_data)
    
    return jsonify(model_data_to_dict(model_data))