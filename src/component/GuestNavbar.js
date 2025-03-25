import React from 'react';
import logo from './Assets/logo-rangmanch.png';
import { Link } from 'react-router-dom';

const GuestNavbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 custom-nav-bg fixed top-0 w-full z-50 ">
      <div className="text-xl font-bold">
      <div className="flex flex-shrink-0 items-center">
                  <img className="h-10 w-auto" src={logo} alt="Your Company" />
                </div>
      </div>
      <div>
        <Link
          to="/login"
          className="px-4 py-2 text-white bg-purple-500 rounded-full hover:bg-purple-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default GuestNavbar;
