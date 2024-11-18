import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/hotelApi";
import LoadingSpinner from "./LoadingSpinner";
import CommentCard from "./CommentCard";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateComment } from "../modules/types";
import { useAuth } from "./AuthProvider";
import ConfirmationModal from "./ConfirmationModal";

const commentSchema = z.object({
  text: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(100, "Comment cannot be more than 100 characters long"),
});

type Props = { hotelId: string; roomId: string };

const CommentSection = ({ hotelId, roomId }: Props) => {
  const [editingIndex, setEditingIndex] = useState<null | number>(null);
  const [editedComment, setEditedComment] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", { hotelId, roomId }],
    queryFn: () => getComments(hotelId, roomId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const mutationCreateComment = useMutation({
    mutationFn: (commentText: CreateComment) =>
      createComment(hotelId, roomId, commentText),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { hotelId, roomId }],
      });
      reset();
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Error creating comment.");
    },
  });

  const mutationUpdateComment = useMutation({
    mutationFn: (updatedComment: { commentId: string; text: string }) =>
      updateComment(hotelId, roomId, updatedComment.commentId, {
        text: updatedComment.text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { hotelId, roomId }],
      });
      setEditingIndex(null);
      toast.success("Comment updated successfully!");
    },
    onError: () => {
      toast.error("Error updating comment.");
    },
  });

  const mutationDeleteComment = useMutation({
    mutationFn: (commentId: string) =>
      deleteComment(hotelId, roomId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { hotelId, roomId }],
      });
      toast.success("Comment deleted successfully!");
    },
    onError: () => {
      toast.error("Error deleting comment.");
    },
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedComment(comments![index].text);
  };

  const handleSave = async () => {
    if (editedComment.length < 2) {
      toast.error("Comment must be at least 2 characters long.");
      return;
    }

    const commentId = comments![editingIndex!].id;

    mutationUpdateComment.mutate({ commentId, text: editedComment });

    setEditedComment("");
  };

  const handleDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      mutationDeleteComment.mutate(commentToDelete);
      setIsDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const onSubmit = (data: { text: string }) => {
    mutationCreateComment.mutate({ text: data.text });
  };

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

      {currentUser && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <textarea
              {...register("text")}
              className="w-full p-2 border border-gray-300 rounded mb-4 min-h-20"
              placeholder="Add a new comment..."
            />
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text.message}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 mr-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Add Comment
              </button>
            </div>
          </form>
        </div>
      )}

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
              className="py-3 px-6 mr-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
              Save
            </button>
            <button
              onClick={() => setEditingIndex(null)}
              className="text-orange-600 hover:text-orange-800"
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
};

export default CommentSection;
