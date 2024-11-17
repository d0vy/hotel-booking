using HotelBookingAPI.Auth.DTOs;
using HotelBookingAPI.Auth.Model;
using HotelBookingAPI.Auth.Services;
using Microsoft.AspNetCore.Identity;
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
                if (user != null)
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

            app.MapPost("api/login", async (LoginDTO dto, UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, SessionService sessionService, HttpContext httpContext) =>
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");
                }

                var isPasswordValid = await userManager.CheckPasswordAsync(user, dto.Password);
                if (!isPasswordValid)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");
                }

                var roles = await userManager.GetRolesAsync(user);

                var sessionId = Guid.NewGuid();
                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = jwtTokenService.CreatRefreshToken(sessionId, user.Id, expiresAt);

                await sessionService.CreateSessionAsync(sessionId, user.Id, refreshToken, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });

            app.MapPost("api/accessToken", async (UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, SessionService sessionService, HttpContext httpContext) =>
            {
                if (!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
                {
                    return Results.UnprocessableEntity();
                }

                if (!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
                {
                    return Results.UnprocessableEntity();
                }

                var sessionId = claims.FindFirstValue("SessionId");
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Results.UnprocessableEntity();
                }

                var sessionIdAsGuid = Guid.Parse(sessionId);
                if (!await sessionService.IsSessionValidAsync(sessionIdAsGuid, refreshToken))
                {
                    return Results.UnprocessableEntity();
                }

                var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return Results.UnprocessableEntity();
                }

                var roles = await userManager.GetRolesAsync(user);

                var expiresAt = DateTime.UtcNow.AddDays(3);
                var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var newRefreshToken = jwtTokenService.CreatRefreshToken(sessionIdAsGuid, user.Id, expiresAt);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                };

                httpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);

                await sessionService.ExtendSessionAsync(sessionIdAsGuid, newRefreshToken, expiresAt);

                return Results.Ok(new SuccessfulLoginDTO(accessToken));
            });

            app.MapPost("api/logout", async (UserManager<HotelUser> userManager, JwtTokenService jwtTokenService, SessionService sessionService, HttpContext httpContext) =>
            {
                if (!httpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
                {
                    return Results.UnprocessableEntity();
                }

                if (!jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
                {
                    return Results.UnprocessableEntity();
                }

                var sessionId = claims.FindFirstValue("SessionId");
                if (string.IsNullOrEmpty(sessionId))
                {
                    return Results.UnprocessableEntity();
                }

                await sessionService.InvalidateSessionAsync(Guid.Parse(sessionId));
                httpContext.Response.Cookies.Delete("RefreshToken");

                return Results.Ok();
            });
        }
    }
}
