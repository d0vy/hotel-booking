import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createHotel, updateHotel } from "../api/hotelApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const hotelSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters"),
  hasPool: z.string().refine((val) => val === "true" || val === "false", {
    message: "HasPool must be specified",
  }),
});

type HotelInputs = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  hotel?: {
    id: string;
    name: string;
    description: string;
    address: string;
    hasPool: boolean;
  };
  onClose: () => void;
}

const HotelForm = ({ hotel, onClose }: HotelFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<HotelInputs>({
    resolver: zodResolver(hotelSchema),
    defaultValues: hotel
      ? {
          name: hotel.name,
          description: hotel.description,
          address: hotel.address,
          hasPool: hotel.hasPool ? "true" : "false",
        }
      : {
          name: "",
          description: "",
          address: "",
          hasPool: "true",
        },
  });

  React.useEffect(() => {
    if (hotel) {
      setValue("name", hotel.name);
      setValue("description", hotel.description);
      setValue("address", hotel.address);
      setValue("hasPool", hotel.hasPool ? "true" : "false");
    }
  }, [hotel, setValue]);

  const onSubmit = async (data: HotelInputs) => {
    const updatedData = {
      ...data,
      hasPool: data.hasPool === "true",
    };

    if (hotel) {
      const response = await updateHotel(hotel.id, updatedData);
      if (!response) {
        toast.error("Hotel Update Failed");
      } else {
        navigate(`/hotel/${hotel.id}`);
        toast.success("Hotel Updated Successfully");
        onClose();
      }
    } else {
      const response = await createHotel(updatedData);
      if (!response) {
        toast.error("Hotel Creation Failed");
      } else {
        navigate(`/hotel/${response.id}`);
        toast.success("Hotel Created Successfully");
        onClose();
      }
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">
          {hotel ? "Edit Hotel" : "Create a New Hotel"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-800"
            >
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full p-4 border-2 ${
                errors.name ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-800"
            >
              Hotel Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className={`w-full p-4 border-2 ${
                errors.description ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-lg font-medium text-gray-800"
            >
              Hotel Address
            </label>
            <input
              id="address"
              type="text"
              {...register("address")}
              className={`w-full p-4 border-2 ${
                errors.address ? "border-red-500" : "border-orange-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-2">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800">
              Has Pool?
            </label>
            <div className="flex items-center space-x-6">
              <div>
                <input
                  id="hasPoolYes"
                  type="radio"
                  {...register("hasPool")}
                  value="true"
                  className="peer h-5 w-5 appearance-none border-2 border-orange-500 rounded-full checked:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <label htmlFor="hasPoolYes" className="ml-2 text-gray-700">
                  Yes
                </label>
              </div>
              <div>
                <input
                  id="hasPoolNo"
                  type="radio"
                  {...register("hasPool")}
                  value="false"
                  className="peer h-5 w-5 appearance-none border-2 border-orange-500 rounded-full checked:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <label htmlFor="hasPoolNo" className="ml-2 text-gray-700">
                  No
                </label>
              </div>
            </div>
            {errors.hasPool && (
              <p className="text-red-500 text-sm mt-2">
                {errors.hasPool.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
              {hotel ? "Save Changes" : "Create Hotel"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-orange-600 hover:text-orange-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelForm;
