import axios from 'axios';
import { auth } from './firebase';

const getProfile = async () => {
  try {
    const user = auth.currentUser;
    const idToken = await user.getIdToken();

    const response = await axios.get("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      withCredentials: true
    });

    console.log("Profile:", response.data);
  } catch (error) {
    console.error("Profile error:", error.response?.data || error.message);
  }
};
