import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../api/hotelApi";
import HotelCard from "../components/HotelCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels?.map((hotel) => {
          return (
            <Link to={`/hotel/${hotel.id}`}>
              <HotelCard key={hotel.id} hotel={hotel} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
