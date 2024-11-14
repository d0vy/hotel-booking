import { useParams } from "react-router-dom";
import { getHotel } from "../api/hotelApi";
import { useQuery } from "@tanstack/react-query";
import NotFoundPage from "./NotFoundPage";
import LoadingSpinner from "../components/LoadingSpinner";
import RoomSection from "../components/RoomSection";

const HotelPage = () => {
  const { hotelId } = useParams();
  if (!hotelId || isNaN(parseInt(hotelId))) {
    return <NotFoundPage />;
  }
  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", { hotelId }],
    queryFn: () => getHotel(hotelId),
  });

  if (!isLoading && !hotel) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-bold text-orange-600">{hotel?.name}</h2>
          <p className="text-lg text-gray-600 mt-4">{hotel?.description}</p>
          <p className="text-lg text-gray-600 mt-4">{hotel?.address}</p>
          <p className="text-lg text-gray-600 mt-4">
            {hotel?.hasPool ? "Has pool" : "No pool"}
          </p>
        </div>
      </div>
      <RoomSection hotelId={hotelId} />
    </div>
  );
};

export default HotelPage;
