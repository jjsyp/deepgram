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
import os


from utils.database_util import create_database_engine

from controllers.database_controller import test_send_to_database


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
print("before engine create")
# Registering the auth blueprint with the Flask app
app.register_blueprint(auth_controller, url_prefix="/api/auth")
app.register_blueprint(model_data_controller)



print(os.getenv("DB_NAME"), os.getenv("DB_USER"), os.getenv("DB_PASS"), os.getenv("DB_HOST"), os.getenv("DB_PORT"))

engine = create_database_engine(os.getenv("DB_NAME"), os.getenv("DB_USER"), os.getenv("DB_PASS"), os.getenv("DB_HOST"), os.getenv("DB_PORT"))
test_send_to_database(engine)


# Runs the Flask application only if the script is executed directly
#if __name__ == "__main__":
    #app.run(port=5000, debug=True)