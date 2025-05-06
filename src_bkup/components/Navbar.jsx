import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">
            <Link to="/dashboard">MyApp</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
