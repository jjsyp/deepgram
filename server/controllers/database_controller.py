from utils.database_util import send_to_database
from services.model_data_service import create_model_data
from utils.database import get_db
from flask import jsonify, request, session
from flask import Blueprint
from models.model_data import ModelData

#create blueprint
database_controller = Blueprint("database_controller", __name__)

@database_controller.route("/database", methods=["POST"])
def test_send_to_database():
    engine = get_db()

    # Load modelTagss from the request body
    data = request.get_json()
    model_tags = data.get('modelTags', [])

    # Fetch models from session
    session_models = session['user']['data']
    print(type(session_models))
    
    model_list = []  # to hold ModelData instances

    #print model tags
    #print(model_tags)
    #print(len(model_tags))
    #loop through model tags, use modelname as key to associate the tags with the tags in session.
    for tag in model_tags:
        model_name = tag['modelName']
        tags = tag['tags']
        #use model name as key to get the model from session
        model = session_models[model_name]
        #add the tags to the model
        model['tags'] = tags
        #print(model)
        #print(type(model))
        model['score'] = 6

        # Create a ModelData instance
        print('Debug pre ModelData:', model)  # Debug to verify model content
        model = ModelData(model['model'], model['language'], model['tier'], model['text'], model['audiofile'], model['email'], model['tags'], model['score'], model['quantifier'])
        print('Debug post ModelData:', model)
        model_list.append(model)
        
    # Call the send_to_database method
    send_to_database(engine, model_list)

    return jsonify({'message': 'Data inserted successfully!'}), 200