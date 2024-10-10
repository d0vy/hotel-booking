using FluentValidation;

namespace HotelBookingAPI.Data.DTOs.Hotel
{
    public record CreateHotelDTO(string Name, string Description, string Address, bool HasPool)
    {
        public class CreateHotelDTOValidator : AbstractValidator<CreateHotelDTO>
        {
            public CreateHotelDTOValidator()
            {
                RuleFor(x => x.Name).NotEmpty().Length(min:2,max:100);
                RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
                RuleFor(x => x.Address).NotEmpty().Length(min: 5, max: 100);
                RuleFor(x => x.HasPool).NotNull();
            }
        }
    };
}
