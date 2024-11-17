using HotelBookingAPI.Data.DTOs.Hotel;
using HotelBookingAPI.Data.Entities;

namespace HotelBookingAPI.Data.Mappers
{
    public static class HotelMappers
    {
        public static HotelDTO ToHotelDTO(this Hotel hotel)
        {
            return new HotelDTO(hotel.Id, hotel.Name, hotel.Description, hotel.Address, hotel.HasPool, hotel.IsClosed, hotel.ImageUrl);
        }
    }
}
