using HotelBookingAPI.Data;
using HotelBookingAPI.Data.Entities;
using HotelBookingAPI.Utils;

namespace HotelBookingAPI.Auth.Services
{
    public class SessionService(HotelDbContext hotelDbContext)
    {
        public async Task CreateSessionAsync(Guid sessionId, string userId, string refreshToken, DateTime expiresAt)
        {
            hotelDbContext.Sessions.Add(new Session
            {
                Id = sessionId,
                UserId = userId,
                InitiatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = expiresAt,
                LastRefreshToken = refreshToken.ToSHA256()
            });

            await hotelDbContext.SaveChangesAsync();
        }

        public async Task ExtendSessionAsync(Guid sessionId, string refreshToken, DateTime expiresAt)
        {
            var session = await hotelDbContext.Sessions.FindAsync(sessionId);
            session.ExpiresAt = expiresAt;
            session.LastRefreshToken = refreshToken.ToSHA256();

            await hotelDbContext.SaveChangesAsync();
        }

        public async Task InvalidateSessionAsync(Guid sessionId)
        {
            var session = await hotelDbContext.Sessions.FindAsync(sessionId);
            if (session == null)
            {
                return;
            }
            session.IsRevoked = true;

            await hotelDbContext.SaveChangesAsync();
        }

        public async Task<bool> IsSessionValidAsync(Guid sessionId, string refreshToken)
        {
            var session = await hotelDbContext.Sessions.FindAsync(sessionId);
            return session != null && session.ExpiresAt > DateTimeOffset.UtcNow && !session.IsRevoked &&
                session.LastRefreshToken == refreshToken.ToSHA256();
        }
    }
}
