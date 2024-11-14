import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-orange-50 text-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
        <h2 className="text-2xl text-orange-700 mb-6">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for might have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-orange-600 text-white hover:bg-orange-700 font-semibold text-lg px-6 py-2 rounded-md transition"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
