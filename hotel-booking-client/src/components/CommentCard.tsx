import { Comment } from "../modules/types";

type Props = {
  comment: Comment;
  onEdit: (index: number) => void;
  onDelete: (index: string) => void;
  index: number;
};

const CommentCard = ({ comment,onEdit, onDelete, index }: Props) => {
  const [date, longTime] = comment.createdAt.toLocaleString().split("T");
  const [time] = longTime.split(".");

  ondevicemotion;

  return (
    <div className="bg-orange-100 p-4 mb-4 rounded-lg shadow-md border border-orange-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-orange-800">
          {comment.userName}
        </h3>
        <p className="text-sm text-orange-600">
          {date} {time}
        </p>
      </div>
      <p className="text-base text-gray-800">{comment.text}</p>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => onEdit(index)}
          className="bg-orange-500 text-white px-3 py-1 rounded mr-2 hover:bg-orange-400"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(comment.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
