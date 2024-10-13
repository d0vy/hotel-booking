using HotelBookingAPI.Data.DTOs.Room;
using HotelBookingAPI.Data.Entities;

namespace HotelBookingAPI.Data.Mappers
{
    public static class RoomMappers
    {
        public static RoomDTO ToRoomDTO(this Room room)
        {
            return new RoomDTO(room.Id, room.Number, room.BedAmount, room.Description);
        }
    }
}
