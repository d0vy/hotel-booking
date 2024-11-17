import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../api/hotelApi";
import HotelCard from "../components/HotelCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const HomePage = () => {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
  });

  const { currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const isAdmin = currentUser?.groups.includes("Admin");

  return (
    <div className="relative">
      {isAdmin && (
        <Link
          to="/hotel"
          className="absolute top-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
        >
          <span className="text-2xl">+</span>
        </Link>
      )}

      {hotels === null || hotels?.length === 0 ? (
        <div className="flex justify-center items-center mt-20">
          <p className="text-xl text-gray-400">No Hotels Found</p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hotels?.map((hotel) => (
            <Link key={hotel.id} to={`/hotel/${hotel.id}`}>
              <HotelCard hotel={hotel} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
