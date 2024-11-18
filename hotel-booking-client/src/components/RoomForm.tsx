import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createRoom, updateRoom } from "../api/hotelApi";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

const roomSchema = z.object({
  number: z.coerce
    .number()
    .min(1, "Number must be at least 1")
    .max(9999, "Number must be at most 9999"),
  bedAmount: z.coerce
    .number()
    .min(1, "Bed amount must be at least 1")
    .max(9999, "Bed amount must be at most 9999"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters"),
});

type RoomInputs = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: {
    id: string;
    number: number;
    bedAmount: number;
    description: string;
  };
  onClose: () => void;
}

const RoomForm = ({ room, onClose }: RoomFormProps) => {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  if (!hotelId || isNaN(parseInt(hotelId))) {
    return <NotFoundPage />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<RoomInputs>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          number: room.number,
          bedAmount: room.bedAmount,
          description: room.description,
        }
      : {
          number: 1,
          bedAmount: 1,
          description: "",
        },
  });

  useEffect(() => {
    if (room) {
      setValue("number", room.number);
      setValue("bedAmount", room.bedAmount);
      setValue("description", room.description);
    }
  }, [room, setValue]);

  const onSubmit = async (data: RoomInputs) => {
    if (room) {
      const response = await updateRoom(hotelId, room.id, data);
      if (!response) {
        toast.error("Room Update Failed");
      } else {
        navigate(`/hotel/${hotelId}/room/${room.id}`);
        toast.success("Room Updated Successfully");
        onClose();
        navigate(0);
      }
    } else {
      const response = await createRoom(hotelId, data);
      if (!response) {
        toast.error("Room Creation Failed");
      } else {
        if (response === "Room with provided number already exists") {
          setError("root", { message: response });
          toast.error("Room Creation Failed");
        } else {
          navigate(`/hotel/${hotelId}/room/${response.id}`);
          toast.success("Room Created Successfully");
          onClose();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">
          {room ? "Edit Room" : "Create a New Room"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="number"
              className="block text-lg font-medium text-gray-800"
            >
              Room Number
            </label>
            <input
              id="number"
              type="number"
              min="1"
              {...register("number")}
              className={`w-full p-4 border-2 ${
                errors.number ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-2">
                {errors.number.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="bedAmount"
              className="block text-lg font-medium text-gray-800"
            >
              Bed Amount
            </label>
            <input
              id="bedAmount"
              type="number"
              min="1"
              {...register("bedAmount")}
              className={`w-full p-4 border-2 ${
                errors.bedAmount ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.bedAmount && (
              <p className="text-red-500 text-sm mt-2">
                {errors.bedAmount.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-800"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className={`w-full p-4 border-2 min-h-20 ${
                errors.description ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
              {room ? "Save Changes" : "Create Room"}
            </button>
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>
          )}
        </form>
        {room ? (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-orange-600 hover:text-orange-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <Link
              to={`/hotel/${hotelId}`}
              className="text-orange-600 hover:text-orange-800"
            >
              Go back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomForm;
