// import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import logo from '../component/Assets/login-logo-new.png';
// import { toast } from "react-toastify";
// import { auth } from "../component/Firebase";
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { FcGoogle } from 'react-icons/fc'; // Import the Google icon from react-icons
// import UniversalLoader from '../Loders/UniversalLoader'; // Import the UniversalLoader component

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleGoogleSignIn = async () => {
//     setLoading(true); // Set loading to true when the sign-in process starts
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Check if the user is new
//       if (result._tokenResponse.isNewUser) {
//         toast.success("Logged in successfully. Please fill in your details.", { position: "top-center" });
//         navigate("/filldetails");
//       } else {
//         toast.success("Logged in successfully.", { position: "top-center" });
//         navigate("/home");
//       }
//     } catch (error) {
//       console.error("Error logging in with Google:", error.message);
//       toast.error("Failed to login with Google!", { position: "top-center" });
//     } finally {
//       setLoading(false); // Set loading to false after the sign-in process is complete
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-color-login">
//       {loading ? (
//         <UniversalLoader />
//       ) : (
//         <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//           <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />
//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color"
//           >
//             <FcGoogle className="mr-2" /> {/* Google icon */}
//             Login with Google
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../component/Assets/login-logo-new.png';
import { toast } from "react-toastify";
import { auth } from "../component/Firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; // Import the Google icon from react-icons
import UniversalLoader from '../Loders/UniversalLoader'; // Import the UniversalLoader component
import { doc, getDoc } from "firebase/firestore";
import { db } from "../component/Firebase";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleGuestLogin = () => {
    navigate("/guest-product"); // Redirect to the guest product page
    toast.info("You're browsing as a guest.", { position: "top-center" });
  };




const handleEmailLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // 🔐 Email verification check
    if (!result.user.emailVerified) {
      toast.warning("Please verify your email first");
      await auth.signOut();
      setLoading(false);
      return;
    }

    // 🔎 Check user document
    const userRef = doc(db, "Users", result.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.success("Please fill in your details");
      navigate("/filldetails");
    } else {
      toast.success("Logged in successfully");
      navigate("/product");
    }

  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-color-login">
      {loading ? (
        <UniversalLoader />
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />

           {/* 🔹 Email Login */}
          <form onSubmit={handleEmailLogin}>
          <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 mb-2">
            <FaEnvelope className="ml-2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
            <div className="flex items-center border-2 rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 mb-2">
            <FaLock className="ml-2 text-gray-500" />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <button className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color">
              Login
            </button>
          </form>

          {/* 🔹 Register Redirect */}
          <p className="text-center mt-3 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer "
            >
              Register
            </span>
          </p>
          <p
            className="text-sm text-center mt-2 text-blue-600 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

         <div className="text-center my-3"></div>


          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color"
          >
            <FcGoogle className="mr-2" /> {/* Google icon */}
            Login with Google
          </button>

          {/* Divider */}
          <div className="text-center my-4 text-gray-500">OR</div>

          {/* Continue as Guest Button */}
          <button
            onClick={handleGuestLogin}
            className="w-full px-4 py-2 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white focus:outline-none focus:shadow-outline"
          >
            Continue as Guest
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;


