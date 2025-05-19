from flask import Flask, request, jsonify, session
from flask_cors import CORS
from firebase_config import auth_admin, admin_auth
from functools import wraps
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.getenv("SECRET_KEY", "supersecret")

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        user = auth_admin.create_user_with_email_and_password(data["email"], data["password"])
        return jsonify({"message": "User created", "user": user}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    try:
        user = auth_admin.sign_in_with_email_and_password(data["email"], data["password"])
        session["user"] = user["idToken"]
        return jsonify({"message": "Login successful", "user": user}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out"}), 200


def verify_firebase_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        id_token = request.headers.get("Authorization")
        if not id_token:
            return jsonify({"error": "Missing Authorization token"}), 401

        # Strip "Bearer " prefix if present
        if id_token.startswith("Bearer "):
            id_token = id_token.replace("Bearer ", "")

        try:
            decoded_token = admin_auth.verify_id_token(id_token)
            request.user = decoded_token  # Attach user info to the request
        except Exception as e:
            print("Token verification failed:", e)
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)
    return wrapper


@app.route("/profile", methods=["GET"])
@verify_firebase_token
def profile():
    user = request.user
    return jsonify({
        "message": "User Profile Accessed",
        "uid": user["uid"],
        "email": user["email"]
    }), 200


@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    try:
        auth_admin.send_password_reset_email(data["email"])
        return jsonify({"message": "Password reset email sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/google-login", methods=["POST"])
def google_login():
    data = request.get_json()
    id_token = data.get("idToken")
    
    if not id_token:
        return jsonify({"error": "Missing ID token"}), 400

    try:
        decoded_token = auth_admin.verify_id_token(id_token)
        uid = decoded_token["uid"]
        email = decoded_token["email"]

        session["user"] = {"uid": uid, "email": email}
        return jsonify({"message": "User authenticated", "email": email}), 200

    except Exception as e:
        print("Token verification failed:", e)
        return jsonify({"error": "Unauthorized"}), 401



if __name__ == "__main__":
    app.run(debug=True)
