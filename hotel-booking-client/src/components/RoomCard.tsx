import { Room } from "../modules/types";

type Props = { room: Room };

const RoomCard = ({ room }: Props) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Room {room.number}
        </h3>
        <p className="text-gray-600 text-sm">Bed amount: {room.bedAmount}</p>
        <p className="text-gray-700 mt-2">{room.description}</p>
      </div>
    </div>
  );
};

export default RoomCard;
