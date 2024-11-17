import { deleteComment, getComments } from "../api/hotelApi";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import CommentCard from "./CommentCard";
import { useState } from "react";
import { login } from "../api/auth/authApi";

type Props = { hotelId: string; roomId: string };

const CommentSection = ({ hotelId, roomId }: Props) => {
  const [editingIndex, setEditingIndex] = useState<null | number>(null);
  const [editedComment, setEditedComment] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedComment(comments![index].text);
  };

  const handleSave = async () => {
    setEditingIndex(null);
    setEditedComment("");
  };

  const handleDelete = (commentId: string) => {
    const res = deleteComment(hotelId, roomId, commentId);
    console.log(res);
  };

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
      <h2 className="text-2xl font-semibold text-center mb-6">Comments</h2>
      {editingIndex !== null ? (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-400"
            >
              Save
            </button>
            <button
              onClick={() => setEditingIndex(null)} // Cancel editing
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : comments === null || comments?.length === 0 ? (
        <div className="text-center text-xl text-gray-400">
          <p>No Comments Found</p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {comments?.map((comment, index) => {
            return (
              <CommentCard
                key={comment.id}
                comment={comment}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
