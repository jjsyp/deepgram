from utils.database_util import send_to_database
from services.model_data_service import create_model_data
from utils.database import get_db
from flask import jsonify
from flask import Blueprint

#create blueprint
database_controller = Blueprint("database_controller", __name__)

@database_controller.route("/database", methods=["POST"])
def test_send_to_database():
    engine = get_db()
    model_data = create_model_data("asteria")

    model_data.email = "testing@email"
    model_data.tags = ["new", "test"]
    model_data.audiofile = b'\x00\x01\x0222'
    model_data.text = "test1 using sqlalchemy"
    model_data.score = 3

    # Call the send_to_database method
    send_to_database(engine, model_data)
    return jsonify({'message': 'Data inserted successfully!'}), 200