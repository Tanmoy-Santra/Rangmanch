import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../component/Assets/login-logo-new.png';
import { toast } from "react-toastify";
import { auth } from "../component/Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; // Import the Google icon from react-icons
import UniversalLoader from '../Loders/UniversalLoader'; // Import the UniversalLoader component

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading to true when the sign-in process starts
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user is new
      if (result._tokenResponse.isNewUser) {
        toast.success("Logged in successfully. Please fill in your details.", { position: "top-center" });
        navigate("/filldetails");
      } else {
        toast.success("Logged in successfully.", { position: "top-center" });
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
      toast.error("Failed to login with Google!", { position: "top-center" });
    } finally {
      setLoading(false); // Set loading to false after the sign-in process is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-color-login">
      {loading ? (
        <UniversalLoader />
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color"
          >
            <FcGoogle className="mr-2" /> {/* Google icon */}
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
