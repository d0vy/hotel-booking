using HotelBookingAPI.Auth.DTOs;
using HotelBookingAPI.Auth.Model;
using HotelBookingAPI.Auth.Services;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

namespace HotelBookingAPI.Auth
{
    public static class AuthEndpoints
    {
        public static void AddAuthEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("api/accounts", async (UserManager<HotelUser> userManager, RegisterUserDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if(user != null)
                {
                    return Results.UnprocessableEntity("Username already taken");
                }

                var newUser = new HotelUser
                {
                    Email = dto.Email,
                    UserName = dto.UserName,
                };

                var createUserResult = await userManager.CreateAsync(newUser, dto.Password);
                if (!createUserResult.Succeeded)
                {
                    return Results.UnprocessableEntity("Username already taken");
                }

                await userManager.AddToRoleAsync(newUser, HotelRoles.HotelUser);

                return Results.Created();
            });

            app.MapPost("api/login", async (UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, LoginDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                {
                    return Results.UnprocessableEntity("Username does not exist");
                }
                Console.WriteLine(user.UserName);
                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);
                if(!isPasswordValid)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");
                }

                var roles = await userManager.GetRolesAsync(user);

                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });
        }
    }
}
