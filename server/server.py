from flask import Flask, g
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session
from sqlalchemy import create_engine
from apscheduler.schedulers.background import BackgroundScheduler
from utils.session_cleanup import clear_flask_session_folder
import os

# Global variable to hold the database engine instance.
engine = None

def create_app():
    """
    Creates and configures the Flask application.

    This function loads environment variables, creates server configurations, and initializes
    necessary extensions like Session and CORS. It also imports and registers the blueprints 

    Returns
    -------
    app: Flask
        The created Flask application.
    """
    
  
    load_dotenv()   # Load environment variables from .env file

    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY"),     # Secret key for the Flask app
        SESSION_TYPE='filesystem',              # Store flask session data on the file system.
        SESSION_COOKIE_SECURE=False,            # Cookies will be sent over HTTP and not HTTPS. set to True in production
        SESSION_COOKIE_HTTPONLY=True,           # Cookies cannot be accessed by client-side scripts.
        SESSION_COOKIE_SAMESITE='Lax',          # Prevents the cookie from being sent in cross-site requests.
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
    def before_request(): # This function runs before each request to the server
        if 'db' not in g: # Set up the db engine in the application context if not done already
            g.db = create_engine(f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}')


    #this function is created in session.cleanup in utils folder.  Note on functionality there should flask session scheme be changed.
    scheduler = BackgroundScheduler() # Create a scheduler to run the session cleanup function
    scheduler.add_job(clear_flask_session_folder, 'interval', hours=4) # Run the session cleanup function every 4 hours
    scheduler.start()    

    return app

app = create_app()


# Runs the Flask application only if the script is executed directly
if __name__ == "__main__":
    app.run(port=5000, debug=True)