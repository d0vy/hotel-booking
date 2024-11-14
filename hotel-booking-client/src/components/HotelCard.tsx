import { Hotel } from "../modules/types";

type Props = {
  hotel: Hotel;
};

const HotelCard = ({ hotel }: Props) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
        <p className="text-gray-600 text-sm">{hotel.address}</p>
        <p className="text-gray-700 mt-2">{hotel.description}</p>
      </div>
    </div>
  );
};

export default HotelCard;
