namespace HotelBookingAPI.Data.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public required int Number { get; set; }
        public required int BedAmount { get; set; }
        public required string Description { get; set; }

        public required int HotelId { get; set; }
        public Hotel Hotel { get; set; }

        public List<Comment> Comments { get; set; }

    }
}
