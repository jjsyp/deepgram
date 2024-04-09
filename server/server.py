from flask import Flask, g
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session
from sqlalchemy import create_engine
from controllers.database_controller import frontend_send_to_database
import os

# Create engine instance to be used across the application.
engine = None

def create_app():
    
    # Load environment variables from .env file
    load_dotenv()

    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY"),
        SESSION_TYPE='filesystem',
        SESSION_COOKIE_SECURE=False, 
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
    )

    # Configuring Session for the Flask app
    Session(app)

    # Enabling CORS for the Flask app
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    CORS(app, supports_credentials=True, origins=FRONTEND_URL)

    # Import and register blueprints AFTER app creation
    from controllers.auth_controller import auth_controller
    from controllers.model_data_controller import model_data_controller
    from controllers.database_controller import database_controller
    app.register_blueprint(auth_controller, url_prefix="/api/auth")
    app.register_blueprint(model_data_controller)
    app.register_blueprint(database_controller) 

    # Create database engine AFTER app creation
    @app.before_request
    def before_request():
        if 'db' not in g:
            g.db = create_engine(f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}')

    return app

app = create_app()


# Runs the Flask application only if the script is executed directly
if __name__ == "__main__":
    app.run(port=5000, debug=True)