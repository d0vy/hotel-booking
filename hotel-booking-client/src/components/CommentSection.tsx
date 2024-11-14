import { getComments } from "../api/hotelApi";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import CommentCard from "./CommentCard";

type Props = { hotelId: string; roomId: string };

const CommentSection = ({ hotelId, roomId }: Props) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", { hotelId, roomId }],
    queryFn: () => getComments(hotelId, roomId),
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
      <hr className="my-8 border-t-4 border-orange-500" />
      <h2 className="text-2xl font-semibold text-center mb-6">Rooms</h2>

      {comments === null || comments?.length === 0 ? (
        <div className="text-center text-xl text-gray-400">
          <p>No Comments Found</p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {comments?.map((comment) => {
            return <CommentCard key={comment.id} comment={comment} />;
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
