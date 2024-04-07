import os
from models.databaseStorage import classStorage
from utils.database import send_to_database
from dotenv import load_dotenv

load_dotenv()

dbName = os.getenv("DB_NAME")
dbUser = os.getenv("DB_USER")
dbPassword = os.getenv("DB_PASS")
dbHost = os.getenv("DB_HOST")
dbPort = os.getenv("DB_PORT")


def test_send_to_database():
    # Dummy data for testing
    model = "Sample Model 2"
    language = "English"
    tier = "Basic"
    text = "This is a sample text."
    audiofile = b'\x00\x01\x02'  # Example bytes for audio file
    tags = ["good", "bad", "indifferent", "who cares"]
    score = 0
    quantifier = "no bueno"
    email = "fuckingWork@gmail.com"

    # Create a list of databaseStorage objects
    data_objects = [classStorage(model, language, tier, text, audiofile, tags, score, quantifier, email)]

    # Call the send_to_database method
    send_to_database(dbName, dbUser, dbPassword, dbHost, dbPort, data_objects)