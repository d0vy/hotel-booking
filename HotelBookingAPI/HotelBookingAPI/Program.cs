using FluentValidation;
using HotelBookingAPI.Data;
using HotelBookingAPI.Data.Validation;
using HotelBookingAPI.Endpoints;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<HotelDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

var app = builder.Build();

app.AddHotelEndpoints();

app.Run();
