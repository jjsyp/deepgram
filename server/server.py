"""
server.py
=================
This is the main entry point to the Flask application.
Sets up and configures the Flask application instance.
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session
from controllers.auth_controller import auth_controller
from controllers.model_data_controller import model_data_controller
from utils.testing import test_send_to_database
import os

from services.model_data_service import create_model_data
from utils.database_util import create_database_connection, close_database_connection, is_open, send_to_database
from models.model_data import ModelData


app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

app.secret_key = os.getenv("SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

# Enabling CORS for the Flask app
CORS(app, supports_credentials=True, origins=FRONTEND_URL)

# Configuring Session for the Flask app
app.config.update(
    SESSION_TYPE='filesystem',
    SESSION_COOKIE_SECURE=False, 
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)

# Applying the session configurations to the Flask app
Session(app) 

# Registering the auth blueprint with the Flask app
app.register_blueprint(auth_controller, url_prefix="/api/auth")
app.register_blueprint(model_data_controller)

#create model
model_data = create_model_data("asteria")
#change audio file due to original audio file size for testing.
model_data.audiofile = b'\x00\x01\x0222'

connection = create_database_connection(os.getenv("DB_NAME"), os.getenv("DB_USER"), os.getenv("DB_PASS"), os.getenv("DB_HOST"), os.getenv("DB_PORT"))

if is_open(connection):
    print("Connection is open.")
else:
    print("Connection is not open.")
    
send_to_database(connection, model_data)

# Close the database connection
close_database_connection(connection)

if is_open(connection):
    print("Connection is open.")
else:
    print("Connection is not open.")

# Runs the Flask application only if the script is executed directly
#if __name__ == "__main__":
    #app.run(port=5000, debug=True)