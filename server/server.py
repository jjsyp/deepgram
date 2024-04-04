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
import os
from utils.storage_util import get_model_storage

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


file_contents = get_model_storage('asteria')
audio_file = file_contents['audio.mp3']
print(audio_file)



# Runs the Flask application only if the script is executed directly
if __name__ == "__main__":
    app.run(port=5000, debug=True)