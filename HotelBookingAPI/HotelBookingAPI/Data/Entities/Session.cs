using HotelBookingAPI.Auth.Model;

namespace HotelBookingAPI.Data.Entities
{
    public class Session
    {
        public Guid Id { get; set; }
        public string LastRefreshToken { get; set; }
        public DateTimeOffset InitiatedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }

        public required string UserId { get; set; }
        public HotelUser User { get; set; }
    }
}
