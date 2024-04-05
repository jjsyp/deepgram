"""
auth_service.py
=====================
This Python file handles Google OAuth 2.0 authentication.
"""

from oauthlib.oauth2 import WebApplicationClient
import os
import requests
import json
from flask import Flask, redirect, request, session, url_for, jsonify

# OAuth 2 client setup
client = WebApplicationClient(os.getenv("GOOGLE_CLIENT_ID"))

def get_user_info():
    """
    Retrieve user information from the session.
    If no user information is found, returns an Unauthorized error.

    Returns:
        JSON: user information.
    """
    
    if 'user' in session:
        return jsonify(**session['user']), 200
    else:
        return "Unauthorized", 401 

def sign_in_google():
    """
    Starts the Google OAuth2.0 login flow and returns a redirect to Google's OAuth 2.0 server.

    Returns:
        Redirection to Google's OAuth 2.0 server.
    """

    google_provider_cfg = requests.get(os.getenv("GOOGLE_DISCOVERY_URL")).json()
    authorization_endpoint = client.prepare_request_uri(
        google_provider_cfg["authorization_endpoint"],
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile", "https://www.googleapis.com/auth/user.birthday.read"], #birthday scope for testing only remove in production.
    )                                                                                               #known issue: non authorized users can still excess apps in external testing unless a google people api is specified thus the birthday scope.
    return redirect(authorization_endpoint)

def google_callback():
    """
    Callback function for the Google OAuth2.0 login flow.
    Parses the authorization code from the request and exchanges it with Google's OAuth 2.0 server for an access token.
    Retrieves user information from Google and stores it into the session.

    Returns:
        Redirection to the protected route: ttstool.
    """
    
    code = request.args.get("code")

    google_provider_cfg = requests.get(os.getenv("GOOGLE_DISCOVERY_URL")).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.getenv("GOOGLE_CLIENT_ID"), os.getenv("GOOGLE_CLIENT_SECRET")),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if userinfo_response.json()["email_verified"]:  # Check if email is verified by Google
        unique_id = userinfo_response.json()["sub"]         # user's unique ID
        users_email = userinfo_response.json()["email"]
        user_data = {}                                     # stores data associated with each audio object

    else:
        return "User email not available or not verified by Google.", 400

    session['user'] = {         # Store user information in session
        "id": unique_id,        # user's unique ID
        "email": users_email,
        "data": user_data
    }
    return redirect(os.getenv("FRONTEND_URL") + "/ttstool")

def logout():
    """
    Clears the user session which effectively logs out the user.

    Returns:
        String: A "Logged out" message with a HTTP 200 status.
    """
    
    session.clear()
    return 'Logged out', 200