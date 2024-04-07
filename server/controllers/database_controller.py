from utils.database_util import send_to_database
from services.model_data_service import create_model_data



def test_send_to_database(engine):
    model_data = create_model_data("asteria")

    model_data.email = "testing@email"
    model_data.tags = ["new", "test"]
    model_data.audiofile = b'\x00\x01\x0222'
    model_data.text = "test1 using sqlalchemy"
    model_data.score = 3

    # Call the send_to_database method
    send_to_database(engine, model_data)