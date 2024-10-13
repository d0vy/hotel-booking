using FluentValidation;
using HotelBookingAPI.Data.DTOs.Room;

namespace HotelBookingAPI.Data.DTOs.Room
{
    public record RoomDTO(int Id, int Number, int BedAmount, string Description)
    {
        public class RoomDTOValidator : AbstractValidator<RoomDTO>
        {
            public RoomDTOValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.Number).NotEmpty().GreaterThan(0);
                RuleFor(x => x.BedAmount).NotEmpty().GreaterThan(0);
                RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
            }
        }
    }
}