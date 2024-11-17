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
import { baseURL } from "../api/axios";
import { FaMapMarkerAlt, FaSwimmingPool } from "react-icons/fa";

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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={baseURL + hotel?.imageUrl}
                alt="Hotel image"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-orange-600 break-words">
                {hotel?.name}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 break-words">
                {hotel?.description}
              </p>

              <div className="text-base sm:text-lg text-gray-600">
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-orange-600" />
                  <span className="font-semibold mr-2">Address: </span>
                  {hotel?.address}
                </p>
                <p className="flex items-center mb-2">
                  <FaSwimmingPool className="mr-2 text-blue-600" />
                  <span className="font-semibold mr-2">Pool: </span>
                  {hotel?.hasPool ? "Has pool" : "No pool"}
                </p>
              </div>
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
