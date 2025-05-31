import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-stone-200 shadow-lg px-8 py-4 border-b border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link
            className="text-black text-3xl font-bold hover:text-blue-600 transition-colors duration-300"
            to="/"
          >
            MyApp
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {isLoggedIn ? (
              <button
                className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="text-black text-xl font-medium hover:text-blue-600 transition-colors duration-300 ml-5"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="text-black text-xl font-medium hover:text-blue-600 transition-colors duration-300 ml-5"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden mt-4 ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <button
                className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors duration-300 text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="text-black text-xl font-medium hover:text-blue-600 transition-colors duration-300"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="text-black text-xl font-medium hover:text-blue-600 transition-colors duration-300"
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
