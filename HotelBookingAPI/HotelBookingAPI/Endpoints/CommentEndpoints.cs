using HotelBookingAPI.Data.Entities;
using HotelBookingAPI.Data;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data.Mappers;
using HotelBookingAPI.Data.DTOs.Comment;

namespace HotelBookingAPI.Endpoints;

public static class CommentEndpoints
{
    public static void AddCommentEndpoints(this IEndpointRouteBuilder app)
    {
        var roomsGroup = app.MapGroup("/api/hotels/{hotelId}/rooms/{roomId}").AddFluentValidationAutoValidation();

        roomsGroup.MapGet("/comments", async (int hotelId, int roomId, HotelDbContext dbContext) =>
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

            var comments = await dbContext.Comments.Where(comment => comment.RoomId == roomId).Select(comment => comment.ToCommentDTO()).ToListAsync();
            return Results.Ok(comments);
        });

        roomsGroup.MapGet("/comments/{commentId}", async (int hotelId, int roomId, int commentId, HotelDbContext dbContext) =>
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

            var comments = await dbContext.Comments.Where(comment => comment.RoomId == roomId && comment.Id == commentId).FirstOrDefaultAsync();
            return comments == null ? Results.NotFound() : Results.Ok(comments.ToCommentDTO());
        });

        roomsGroup.MapPost("/comments", async (int hotelId, int roomId, CreateCommentDTO dto, HotelDbContext dbContext) =>
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

            var comment = new Comment
            {
                Text = dto.Text,
                CreatedAt = DateTimeOffset.UtcNow,
                RoomId = roomId,
            };

            dbContext.Comments.Add(comment);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/api/hotels/{hotelId}/rooms/{roomId}/comments/{comment.Id}", comment.ToCommentDTO());
        });

        roomsGroup.MapPut("/comments/{commentId}", async (UpdateCommentDTO dto, int hotelId, int roomId, int commentId, HotelDbContext dbContext) =>
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

            var comment = await dbContext.Comments.Where(comment => comment.RoomId == roomId && comment.Id == commentId).FirstOrDefaultAsync();
            if (comment == null)
            {
                return Results.NotFound();
            }

            comment.Text = dto.Text;

            dbContext.Comments.Update(comment);
            await dbContext.SaveChangesAsync();

            return Results.Ok(comment.ToCommentDTO());
        });

        roomsGroup.MapDelete("/comments/{commentId}", async (int hotelId, int roomId, int commentId, HotelDbContext dbContext) =>
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

            var comment = await dbContext.Comments.Where(comment => comment.RoomId == roomId && comment.Id == commentId).FirstOrDefaultAsync();
            if (comment == null)
            {
                return Results.NotFound();
            }

            dbContext.Comments.Remove(comment);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

