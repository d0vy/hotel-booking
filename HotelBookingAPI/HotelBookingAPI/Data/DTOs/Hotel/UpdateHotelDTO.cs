using FluentValidation;

namespace HotelBookingAPI.Data.DTOs.Hotel
{
    public record UpdateHotelDTO(string Name, string Description, string Address, bool HasPool, bool IsClosed, IFormFile Image)
    {
        public class UpdateHotelDTOValidator : AbstractValidator<UpdateHotelDTO>
        {
            public UpdateHotelDTOValidator()
            {
                RuleFor(x => x.Name).NotEmpty().Length(min: 2, max: 100);
                RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
                RuleFor(x => x.Address).NotEmpty().Length(min: 5, max: 100);
                RuleFor(x => x.HasPool).NotNull();
                RuleFor(x => x.IsClosed).NotNull();
            }
        }
    }
}
