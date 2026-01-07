import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../component/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
import logo from '../component/Assets/login-logo-new.png';
import LocalLoader from "../Loders/LocalLoader";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import UniversalLoader from "../Loders/UniversalLoader";
 


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(result.user);

    toast.success("Verification email sent. Please verify your email.");
    navigate("/login");
  } catch (error) {
    toast.error(error.message);
  }finally{
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen">
     {loading?(      
      <UniversalLoader/>
      ):(        
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
      <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 mb-2">
          <FaEnvelope className="ml-2 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 mb-2">
          <FaLock className="ml-2 text-gray-500" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 mb-3">
          <FaLock className="ml-2 text-gray-500" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color">
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
      )}
    </div>
  );
};

export default Register;
