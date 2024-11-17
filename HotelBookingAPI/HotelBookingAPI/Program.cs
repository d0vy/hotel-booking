using FluentValidation;
using HotelBookingAPI.Auth;
using HotelBookingAPI.Auth.Model;
using HotelBookingAPI.Auth.Services;
using HotelBookingAPI.Data;
using HotelBookingAPI.Data.Validation;
using HotelBookingAPI.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod().
                          AllowCredentials());
});

builder.Services.AddDbContext<HotelDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddTransient<SessionService>();
builder.Services.AddScoped<AuthSeeder>();

builder.Services.AddIdentity<HotelUser, IdentityRole>()
    .AddEntityFrameworkStores<HotelDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
});

builder.Services.AddAuthorization();

var app = builder.Build();

using var scope = app.Services.CreateScope();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthSeeder>();
await dbSeeder.SeedAsync();

app.UseCors("AllowSpecificOrigin");
app.AddAuthEndpoints();

app.AddHotelEndpoints();
app.AddRoomEndpoints();
app.AddCommentEndpoints();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
