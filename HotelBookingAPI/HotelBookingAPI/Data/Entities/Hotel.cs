namespace HotelBookingAPI.Data.Entities
{
    public class Hotel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Address { get; set; }
        public required bool HasPool { get; set; }
        public required DateTimeOffset AddedAt { get; set; }
        public required bool IsClosed { get; set; }
        
    }
}
