using HotelBookingAPI.Data.Entities;
using HotelBookingAPI.Data;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using HotelBookingAPI.Data.Mappers;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data.DTOs.Room;
using HotelBookingAPI.Auth.Model;
using Microsoft.AspNetCore.Authorization;

namespace HotelBookingAPI.Endpoints;

public static class RoomEndpoints
{
    public static void AddRoomEndpoints(this IEndpointRouteBuilder app)
    {
        var roomsGroup = app.MapGroup("/api/hotels/{hotelId}").AddFluentValidationAutoValidation();

        roomsGroup.MapGet("/rooms", async (int hotelId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            var rooms = await dbContext.Rooms.Where(room => room.HotelId == hotelId).Select(room => room.ToRoomDTO()).ToListAsync();
            return Results.Ok(rooms);
        });

        roomsGroup.MapGet("/rooms/{roomId}", async (int hotelId, int roomId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            var room = await dbContext.Rooms.Where(room => room.HotelId == hotelId && room.Id == roomId).FirstOrDefaultAsync();
            return room == null ? Results.NotFound() : Results.Ok(room.ToRoomDTO());
        });

        roomsGroup.MapPost("/rooms", [Authorize(Roles = HotelRoles.Admin)] async (int hotelId, CreateRoomDTO dto, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            var room = new Room
            {
                Number = dto.Number,
                BedAmount = dto.BedAmount,
                Description = dto.Description,
                HotelId = hotelId,
            };

            dbContext.Rooms.Add(room);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/api/hotels/{hotelId}/rooms/{room.Id}", room.ToRoomDTO());
        });

        roomsGroup.MapPut("/rooms/{roomId}", [Authorize(Roles = HotelRoles.Admin)] async (UpdateRoomDTO dto, int hotelId, int roomId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            var room = await dbContext.Rooms.Where(room => room.HotelId == hotelId && room.Id == roomId).FirstOrDefaultAsync();
            if (room == null)
            {
                return Results.NotFound();
            }

            room.Number = dto.Number;
            room.BedAmount = dto.BedAmount;
            room.Description = dto.Description;

            dbContext.Rooms.Update(room);
            await dbContext.SaveChangesAsync();

            return Results.Ok(room.ToRoomDTO());
        });

        roomsGroup.MapDelete("/rooms/{roomId}", [Authorize(Roles = HotelRoles.Admin)] async (int hotelId, int roomId, HotelDbContext dbContext) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            var room = await dbContext.Rooms.Where(room => room.HotelId == hotelId && room.Id == roomId).FirstOrDefaultAsync();
            if (room == null)
            {
                return Results.NotFound();
            }

            dbContext.Rooms.Remove(room);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

