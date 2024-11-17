import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { deleteHotel, getHotel } from "../api/hotelApi";
import NotFoundPage from "./NotFoundPage";
import LoadingSpinner from "../components/LoadingSpinner";
import HotelForm from "../components/HotelForm";
import { useState } from "react";
import RoomSection from "../components/RoomSection";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-toastify";

const HotelPage = () => {
  const { hotelId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!hotelId || isNaN(parseInt(hotelId))) {
    return <NotFoundPage />;
  }

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", { hotelId }],
    queryFn: () => getHotel(hotelId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hotel) {
    return <NotFoundPage />;
  }

  const isAdmin = currentUser?.groups.includes("Admin");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteHotel(hotelId);
      if (response === "success") {
        toast.success("Hotel Deleted Successfully");
        navigate("/");
      } else {
        toast.error("Hotel Deletion Failed");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the hotel.");
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col">
        {isAdmin && !isEditMode && (
          <div className="flex justify-end mt-4 space-x-4">
            <button
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditMode ? (
        <HotelForm hotel={hotel} onClose={() => setIsEditMode(false)} />
      ) : (
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-4xl font-bold text-orange-600">
                {hotel?.name}
              </h2>
              <p className="text-lg text-gray-600 mt-4">{hotel?.description}</p>
              <p className="text-lg text-gray-600 mt-4">{hotel?.address}</p>
              <p className="text-lg text-gray-600 mt-4">
                {hotel?.hasPool ? "Has pool" : "No pool"}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex justify-end mt-4 relative">
              <Link
                to={`/hotel/${hotelId}/room`}
                className="absolute top-10 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
              >
                <span className="text-2xl">+</span>
              </Link>
            </div>
          )}
          <RoomSection hotelId={hotelId} />
        </div>
      )}
    </div>
  );
};

export default HotelPage;
