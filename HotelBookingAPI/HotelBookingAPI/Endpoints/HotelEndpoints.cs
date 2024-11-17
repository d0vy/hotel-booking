using HotelBookingAPI.Data.DTOs.Hotel;
using HotelBookingAPI.Data;
using HotelBookingAPI.Data.Mappers;
using HotelBookingAPI.Data.Entities;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Auth.Model;
using Microsoft.AspNetCore.Authorization;
using System;
using Microsoft.AspNetCore.Mvc;

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

        hotelsGroup.MapPost("/hotels", [Authorize(Roles = HotelRoles.Admin)] async ([FromForm] CreateHotelDTO dto, HotelDbContext dbContext, IHostEnvironment environment) =>
        {
            if (dto.Image == null || dto.Image.Length == 0)
            {
                return Results.BadRequest("No image uploaded.");
            }

            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
            var extension = Path.GetExtension(dto.Image.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                return Results.BadRequest("Invalid file type. Only PNG, JPG, or JPEG files are allowed.");
            }

            if (dto.Image.Length > 2 * 1024 * 1024)
            {
                return Results.BadRequest("File size must be less than 2MB.");
            }

            var filePath = Path.Combine(environment.ContentRootPath, "wwwroot", "uploads", Guid.NewGuid() + extension);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.Image.CopyToAsync(stream);
            }

            var hotel = new Hotel
            {
                Name = dto.Name,
                Description = dto.Description,
                Address = dto.Address,
                HasPool = dto.HasPool,
                ImageUrl = "/uploads/" + Path.GetFileName(filePath),
                AddedAt = DateTimeOffset.UtcNow,
                IsClosed = false
            };

            dbContext.Hotels.Add(hotel);
            await dbContext.SaveChangesAsync();

            return Results.Created($"api/hotels/{hotel.Id}", hotel.ToHotelDTO());
        }).DisableAntiforgery();

        hotelsGroup.MapPut("/hotels/{hotelId}", [Authorize(Roles = HotelRoles.Admin)] async ([FromForm] UpdateHotelDTO dto, int hotelId, HotelDbContext dbContext, IHostEnvironment environment) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
                var extension = Path.GetExtension(dto.Image.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                {
                    return Results.BadRequest("Invalid file type. Only PNG, JPG, or JPEG files are allowed.");
                }

                if (dto.Image.Length > 2 * 1024 * 1024)
                {
                    return Results.BadRequest("File size must be less than 2MB.");
                }

                if (!string.IsNullOrEmpty(hotel.ImageUrl))
                {
                    var oldImagePath = Path.Combine(environment.ContentRootPath, "wwwroot", hotel.ImageUrl.TrimStart('/'));
                    if (File.Exists(oldImagePath))
                    {
                        File.Delete(oldImagePath);
                    }
                }

                var filePath = Path.Combine(environment.ContentRootPath, "wwwroot", "uploads", Guid.NewGuid() + extension);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                hotel.ImageUrl = "/uploads/" + Path.GetFileName(filePath);
            }

            hotel.Name = dto.Name;
            hotel.Description = dto.Description;
            hotel.Address = dto.Address;
            hotel.HasPool = dto.HasPool;
            hotel.IsClosed = dto.IsClosed;

            dbContext.Hotels.Update(hotel);
            await dbContext.SaveChangesAsync();

            return Results.Ok(hotel.ToHotelDTO());
        }).DisableAntiforgery();

        hotelsGroup.MapDelete("/hotels/{hotelId}", [Authorize(Roles = HotelRoles.Admin)] async (int hotelId, HotelDbContext dbContext, IHostEnvironment environment) =>
        {
            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return Results.NotFound();
            }

            if (!string.IsNullOrEmpty(hotel.ImageUrl))
            {
                var imagePath = Path.Combine(environment.ContentRootPath, "wwwroot", hotel.ImageUrl.TrimStart('/'));

                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }
            }

            dbContext.Hotels.Remove(hotel);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

