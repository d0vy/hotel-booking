using HotelBookingAPI.Auth.DTOs;
using HotelBookingAPI.Auth.Model;
using HotelBookingAPI.Auth.Services;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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

            app.MapPost("api/login", async (UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, HttpContext httpContext,LoginDTO dto) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                {
                    return Results.UnprocessableEntity("Username does not exist");
                }

                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);
                if(!isPasswordValid)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");
                }

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = jwtTokenService.CreatRefreshToken(user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });

            app.MapPost("api/accessToken", async (UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, HttpContext httpContext) =>
            {
                if(!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
                {
                    return Results.UnprocessableEntity();
                }

                if(!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
                {
                    return Results.UnprocessableEntity();
                }

                var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = await userManager.FindByIdAsync(userId);
                if(user == null)
                {
                    return Results.UnprocessableEntity();
                }

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var newRefreshToken = jwtTokenService.CreatRefreshToken(user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });
        }
    }
}
