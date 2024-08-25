import React, { useState, useEffect } from "react";
import { auth, db } from "../component/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import logo from '../component/Assets/login-logo-new.png';
import { FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons from react-icons
import UniversalLoader from '../Loders/UniversalLoader'; // Import the UniversalLoader component

const FillDetails = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const validate = () => {
    const errors = {};

    if (!fname.trim()) {
      errors.fname = "First name is required";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!address.trim()) {
      errors.address = "Address is required";
    }

    return errors;
  };

  const handleFillDetails = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Set loading to true when submission starts
      try {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          phone: phone,
          address: address,
          photo: user.photoURL // Example field, adjust as per your database structure
        });
        toast.success("Details saved successfully!", { position: "top-center" });
        navigate("/home");
      } catch (error) {
        console.error("Error saving details:", error.message);
        toast.error(error.message, { position: 'top-center' });
      } finally {
        setLoading(false); // Set loading to false after submission
      }
    } else {
      toast.error("Please correct the highlighted errors.", { position: "top-center" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-color-login">
      {loading ? (
        <UniversalLoader />
      ) : (
        <form onSubmit={handleFillDetails} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <img className="h-30 w-auto mb-4" src={logo} alt="Your Company" />
          <h3 className="text-2xl font-bold mb-4">Fill Your Details</h3>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">First name</label>
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <FaUser className="ml-2 text-gray-500" />
              <input
                type="text"
                className="w-full px-3 py-2 focus:outline-none"
                placeholder="First name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Last name</label>
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <FaUser className="ml-2 text-gray-500" />
              <input
                type="text"
                className="w-full px-3 py-2 focus:outline-none"
                placeholder="Last name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Phone number</label>
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <FaPhone className="ml-2 text-gray-500" />
              <input
                type="text"
                className="w-full px-3 py-2 focus:outline-none"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Address</label>
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <FaMapMarkerAlt className="ml-2 text-gray-500" />
              <input
                type="text"
                className="w-full px-3 py-2 focus:outline-none"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="mb-4">
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline btn-custom-color">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FillDetails;
