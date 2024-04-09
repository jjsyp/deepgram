from utils.database_util import send_to_database
from utils.database import get_db
from flask import jsonify, request, session, Blueprint
from models.model_data import ModelData
from services.model_data_service import remove_model_data_from_session

#create blueprint
database_controller = Blueprint("database_controller", __name__)

@database_controller.route("/database", methods=["POST"])
def frontend_send_to_database():
    engine = get_db()

    # Load modelTagss from the request body
    data = request.get_json()
    model_tags = data.get('modelTags', [])

    # Fetch models from session
    session_models = session['user']['data']
    print(type(session_models))
    
    model_list = []  # to hold ModelData instances

    #loop through model tags, use modelname as key to associate the tags with the tags in session.
    for tag in model_tags:
        model_name = tag['modelName']  # get the model name from the tag
        tags = tag['tags']  # get the tags from the tag
        model = session_models[model_name]  # get the model from the session
        model['tags'] = tags # add the tags to the model


        # Create a ModelData instance
        model = ModelData(model['model'], model['language'], model['tier'], model['text'], model['audiofile'], model['email'], model['tags'], model['score'], model['quantifier'])
        model_list.append(model)
        
    # Call the send_to_database method
    send_to_database(engine, model_list)
    
    #remove the model data from the session
    for model in model_list:
        remove_model_data_from_session(model.model)
        

    return jsonify({'message': 'Data inserted successfully!'}), 200