import React, { useState } from "react";
import { auth } from "../component/Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import LocalLoader from "../Loders/LocalLoader";
import logo from '../component/Assets/login-logo-new.png';
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleReset = async (e) => {
    e.preventDefault();
     setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
    {loading?(      
      <LocalLoader/>
      ):(    
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
       <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color">
          Send Reset Link
        </button>
      </form>
      )}
    </div>
  );
};

export default ForgotPassword;
