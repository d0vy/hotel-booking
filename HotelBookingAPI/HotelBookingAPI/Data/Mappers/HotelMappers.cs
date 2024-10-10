using HotelBookingAPI.Data.DTOs.Hotel;
using HotelBookingAPI.Data.Entities;
using System.Xml.Serialization;

namespace HotelBookingAPI.Data.Mappers
{
    public static class HotelMappers
    {
        public static HotelDTO ToHotelDTO(this Hotel hotel)
        {
            return new HotelDTO(hotel.Id, hotel.Name, hotel.Description, hotel.Address, hotel.HasPool, hotel.IsClosed);
        }
    }
}
