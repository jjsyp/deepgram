import os
#from models.databaseStorage import classStorage
from utils.database import send_to_database
from services.model_data_service import create_model_data
from dotenv import load_dotenv

load_dotenv()

dbName = os.getenv("DB_NAME")
dbUser = os.getenv("DB_USER")
dbPassword = os.getenv("DB_PASS")
dbHost = os.getenv("DB_HOST")
dbPort = os.getenv("DB_PORT")


def test_send_to_database():
    model_data = create_model_data("asteria")

    model_data.email = "testing, dataobject as list"
    model_data.tags = ["new", "test"]
    #model_data.audiofile = b'\x00\x01\x0222'
    model_data.text = "audio file from model"
    model_data.score = 3

    # Call the send_to_database method
    send_to_database(dbName, dbUser, dbPassword, dbHost, dbPort, model_data)
