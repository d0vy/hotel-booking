using HotelBookingAPI.Data.DTOs.Hotel;
using HotelBookingAPI.Data;
using HotelBookingAPI.Data.Mappers;
using HotelBookingAPI.Data.Entities;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingAPI.Endpoints;

public static class HotelEndpoints
{
    public static void AddHotelEndpoints(this IEndpointRouteBuilder app)
    {
        var hotelsGroup = app.MapGroup("/api/").AddFluentValidationAutoValidation();

        hotelsGroup.MapGet("/hotels", async (HotelDbContext dbContext) =>
        {
            return await dbContext.Hotels.Select(hotel => hotel.ToHotelDTO()).ToListAsync();
        });

        hotelsGroup.MapGet("/hotels/{hotelId}", async (int hotelId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            return hotel == null ? Results.NotFound() : Results.Ok(hotel.ToHotelDTO());
        });

        hotelsGroup.MapPost("/hotels", async (CreateHotelDTO dto, HotelDbContext dbContext) =>
        {
            var hotel = new Hotel
            {
                Name = dto.Name,
                Description = dto.Description,
                Address = dto.Address,
                HasPool = dto.HasPool,
                AddedAt = DateTimeOffset.UtcNow,
                IsClosed = false
            };

            dbContext.Hotels.Add(hotel);
            await dbContext.SaveChangesAsync();

            return Results.Created($"api/hotels/{hotel.Id}", hotel.ToHotelDTO());
        });

        hotelsGroup.MapPut("/hotels/{hotelId}", async (UpdateHotelDTO dto, int hotelId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            hotel.Name = dto.Name;
            hotel.Description = dto.Description;
            hotel.Address = dto.Address;
            hotel.HasPool = dto.HasPool;
            hotel.IsClosed = dto.IsClosed;

            dbContext.Hotels.Update(hotel);
            await dbContext.SaveChangesAsync();

            return Results.Ok(hotel.ToHotelDTO());
        });

        hotelsGroup.MapDelete("/hotels/{hotelId}", async (int hotelId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            dbContext.Hotels.Remove(hotel);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

