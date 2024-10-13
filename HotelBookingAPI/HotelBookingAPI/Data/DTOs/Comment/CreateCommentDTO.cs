using FluentValidation;

namespace HotelBookingAPI.Data.DTOs.Comment
{
    public record class CreateCommentDTO(string Text)
    {
        public class CreateCommentDTOValidator : AbstractValidator<CreateCommentDTO>
        {
            public CreateCommentDTOValidator()
            {
                RuleFor(x => x.Text).NotEmpty().Length(min: 2, max: 100);
            }
        }
    }
}
