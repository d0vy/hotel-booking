import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../api/hotelApi";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentSection from "../components/CommentSection";

const RoomPage = () => {
  const { hotelId, roomId } = useParams();
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

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-bold text-orange-600">
            Room {room?.number}
          </h2>
          <p className="text-lg text-gray-600 mt-4">{room?.description}</p>
          <p className="text-lg text-gray-600 mt-4">{room?.bedAmount}</p>
        </div>
      </div>
      <CommentSection hotelId={hotelId} roomId={roomId} />
    </div>
  );
};

export default RoomPage;
