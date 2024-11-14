import { Comment } from "../modules/types";

type Props = { comment: Comment };

const CommentCard = ({ comment }: Props) => {
  const [date, longTime] = comment.createdAt.toLocaleString().split("T");
  const [time] = longTime.split(".");

  return (
    <div className="bg-orange-100 p-4 mb-4 rounded-lg shadow-md border border-orange-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-orange-800">{comment.id}</h3>
        <p className="text-sm text-orange-600">
          {date} {time}
        </p>
      </div>
      <p className="text-base text-gray-800">{comment.text}</p>
    </div>
  );
};

export default CommentCard;
