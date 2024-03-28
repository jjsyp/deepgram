"""
auth_controller.py
=====================
This Python file sets up the Blueprint for OAuth 2.0 Authentication controls.
"""

from flask import Blueprint, request
from services.auth_service import sign_in_google, google_callback, logout, get_user_info

# Declare the blueprint for auth_controller
auth_controller = Blueprint('auth_controller', __name__)

@auth_controller.route("/signin-google")
def signin_google_controller():
    """
    Handles the sign-in process using Google's OAuth 2.0

    Returns:
        Calls and produces return value from service function sign_in_google()
    """
    return sign_in_google()

@auth_controller.route("/signin-google/callback")
def callback_controller():
    """
    Handles callback from Google's OAuth 2.0 Sign-In flow

    Returns:
        Calls and produces return value from service function google_callback()
    """
    return google_callback()

@auth_controller.route('/logout', methods=['POST'])
def logout_controller():
    """
    Handles the logout process to clear user session

    Returns:
        Calls and produces return value from service function logout()
    """
    return logout()

@auth_controller.route('/user', methods=["GET"])
def get_user_controller():
    """
    Retrieves user information from the session
    
    Returns:
        Calls and produces return value from service function get_user_info()
    """
    return get_user_info()