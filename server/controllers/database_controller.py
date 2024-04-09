from utils.database_util import send_to_database
from services.model_data_service import create_model_data
from utils.database import get_db
from flask import jsonify
from flask import Blueprint
from flask import request

#create blueprint
database_controller = Blueprint("database_controller", __name__)

@database_controller.route("/database", methods=["POST"])
def test_send_to_database():
    engine = get_db()
    data = request.get_json()
    model_tags = data.get('modelTags', [])

    engine = get_db()

    # For each model-tag pair, send the data to the database
    for model_tag in model_tags:
        model_name = model_tag.get('modelName', None)
        tags = model_tag.get('tags', [])

        if model_name and tags:
            # Call the send_to_database method for each model and its tags
            send_to_database(engine, model_name, tags)

    return jsonify({'message': 'Data inserted successfully!'}), 200