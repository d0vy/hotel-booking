import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useQuery } from "@tanstack/react-query";
import { deleteRoom, getRoom } from "../api/hotelApi";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-toastify";
import RoomForm from "../components/RoomForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../components/ConfirmationModal";

const RoomPage = () => {
  const { hotelId, roomId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!hotelId || isNaN(parseInt(hotelId))) {
    return <NotFoundPage />;
  }

  if (!roomId || isNaN(parseInt(roomId))) {
    return <NotFoundPage />;
  }

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", { hotelId, roomId }],
    queryFn: () => getRoom(hotelId, roomId),
  });

  if (!isLoading && !room) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const isAdmin = currentUser?.groups.includes("Admin");

  const handleDelete = async () => {
    try {
      const response = await deleteRoom(hotelId, roomId);
      if (response === "success") {
        toast.success("Room Deleted Successfully");
        navigate(`/hotel/${hotelId}`);
      } else {
        toast.error("Room Deletion Failed");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the room.");
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container mx-auto py-12 mt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Link
            to={`/hotel/${hotelId}`}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go back to hotel page
          </Link>

          {isAdmin && !isEditMode && (
            <div className="flex space-x-4 ml-auto">
              <button
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                onClick={() => setIsEditMode(true)}
              >
                <span>Edit</span>
              </button>
              <button
                onClick={openDeleteModal}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditMode ? (
        <RoomForm room={room} onClose={() => setIsEditMode(false)} />
      ) : (
        <div className="mt-8">
          <div className="space-y-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold text-orange-600">
                Room {room?.number}
              </h2>
              <p className="text-lg text-gray-600 mt-4">{room?.description}</p>

              <div className="mt-6 space-y-4">
                <p className="flex items-center text-lg text-gray-700">
                  <FaBed className="mr-3 text-orange-500" />
                  <span className="font-semibold mr-2">Beds: </span>{" "}
                  {room?.bedAmount}
                </p>
              </div>
            </div>
          </div>

          <CommentSection hotelId={hotelId} roomId={roomId} />
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default RoomPage;
