import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider"; // Assuming you have an AuthProvider for user management

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, handleLogout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
              />
            </svg>
            QuickHotel
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-4">
          <Link
            to="/"
            className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
          >
            Home
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white font-semibold">
                {currentUser?.userName}
              </span>
              <button
                onClick={handleLogout}
                className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 bg-orange-500 hover:bg-orange-600 rounded-lg focus:outline-none"
        >
          <div
            className={`w-6 h-1 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-1 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-1 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>

      <div
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } fixed inset-0 bg-gray-800 bg-opacity-75 md:hidden transition-transform duration-500 ease-in-out z-40`}
      >
        <div className="flex flex-col space-y-4 px-4 py-6 pt-20 absolute right-0 w-2/4 h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg z-50">
          <Link
            to="/"
            className="text-white text-center mt-4 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
            onClick={toggleMenu}
          >
            Home
          </Link>

          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="text-white text-center mt-4 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white text-center mt-4 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 border-2 border-gray-700"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white font-semibold text-center mt-4">
                {currentUser?.userName}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 mt-2 border-2 border-gray-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
