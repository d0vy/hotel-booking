using HotelBookingAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Data
{
    public class HotelDbContext :DbContext
    {
        private readonly IConfiguration _configuration;

        public DbSet<Hotel> Hotels { get; set; }

        public HotelDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("PostgreSQL"));
        }
    }
}
