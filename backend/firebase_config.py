import firebase_admin
from firebase_admin import credentials, auth as admin_auth
import pyrebase
import os

# Admin SDK for server-side operations (e.g., token verification)
cred = credentials.Certificate("firebase.json")
firebase_admin.initialize_app(cred)


# Pyrebase for client-like functions (email/password auth)
firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "databaseURL": ""  # optional



}

firebase = pyrebase.initialize_app(firebaseConfig)
auth_admin = firebase.auth()  # for register/login/reset-password with Pyrebase

# For verifying token from frontend (Google Sign-In)
# This is used in app.py as well
auth_admin.verify_id_token = admin_auth.verify_id_token

