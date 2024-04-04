
import psycopg2
from psycopg2._psycopg import connection

from config import config

# FINISH THIS
class databaseStorage(object):
    model: str
    language: str
    tier: str
    text: str
    audiofile: bytes

    # constructor
    def __init__(self, model, language, tier, text, audiofile):
        self.model = model
        self.language = language
        self.tier = tier
        self.text = text
        self.audiofile = audiofile

    def send_to_database(self, dbname, user, password, host, port):
        connection = None
        try:
            params = {
                'dbname': dbname,
                'user': user,
                'password': password,
                'host': host,
                'port': port
            }
            print('Connecting to the PostgreSQL database...')
            connection = psycopg2.connect(**params)
            cursor = connection.cursor()

            # Example of executing a database insert statement using the data from the instance
            cursor.execute("INSERT INTO your_table_name (model, language, tier, text, audiofile) VALUES (%s, %s, %s, %s, %s)",
                           (self.model, self.language, self.tier, self.text, psycopg2.Binary(self.audiofile)))
            connection.commit()

            print("Data inserted successfully!")

        except(Exception, psycopg2.DatabaseError) as error:
            print("Error:", error)
        finally:
            if connection is not None:
                connection.close()
                print('Database connection terminated.')

# Example usage:
if __name__ == "__main__":
    # Dummy data for testing
    model = "Sample Model"
    language = "English"
    tier = "Basic"
    text = "This is a sample text."
    audiofile = b'\x00\x01\x02'  # Example bytes for audio file

    # Create an instance of the databaseStorage class
    data = databaseStorage(model, language, tier, text, audiofile)

    # Call the method to send data to PostgreSQL
    data.send_to_database(dbname='your_db_name', user='your_username', password='your_password', host='your_host', port='your_port')
