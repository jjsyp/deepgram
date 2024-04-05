from server.models.databaseStorage import classStorage
from database import send_to_database

if __name__ == "__main__":
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
    send_to_database(dbname='deepgramtestdb', user='postgres', password='MrRed3000!', host='localhost', port='2024', data_objects=data_objects)
