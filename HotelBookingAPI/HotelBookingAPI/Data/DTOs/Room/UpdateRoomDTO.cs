using FluentValidation;
using HotelBookingAPI.Data.DTOs.Room;

namespace HotelBookingAPI.Data.DTOs.Room
{
    public record UpdateRoomDTO(int Number, int BedAmount, string Description)
    {
        public class UpdateRoomDTOValidator : AbstractValidator<UpdateRoomDTO>
        {
            public UpdateRoomDTOValidator()
            {
                RuleFor(x => x.Number).NotEmpty().GreaterThan(0);
                RuleFor(x => x.BedAmount).NotEmpty().GreaterThan(0);
                RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
            }
        }
    }
}

