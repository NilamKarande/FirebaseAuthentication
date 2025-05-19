import React, { useState } from 'react';
import axios from 'axios';
import { firebase } from './firebase'; // Make sure firebase is exported properly from this file

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);

  const register = async () => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
      }, { withCredentials: true });
      console.log("Register success:", response.data);
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
    }
  };

  const login = async () => {
    try {
      await axios.post("http://localhost:5000/login", { email, password }, { withCredentials: true });
      await getProfile();
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/reset-password", { email });
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error.message);
    }
  };

  const getProfile = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.warn("No user logged in.");
        return;
      }

      const idToken = await user.getIdToken();

      const response = await axios.get("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        withCredentials: true,
      });

      console.log("Profile:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Profile error:", error.response?.data || error.message);
    }
  };

  const googleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      await axios.post("http://localhost:5000/google-login", { idToken }, { withCredentials: true });

      // Get and show profile after Google login success
      await getProfile();

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div>
      <h2>Firebase Auth</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={resetPassword}>Reset Password</button>
      <button onClick={googleLogin}>Sign in with Google</button>

      {profile && (
        <div style={{ marginTop: "20px" }}>
          <h3>Welcome, {profile.email}</h3>
          <p>User ID: {profile.uid}</p>
        </div>
      )}
    </div>
  );
}

export default App;