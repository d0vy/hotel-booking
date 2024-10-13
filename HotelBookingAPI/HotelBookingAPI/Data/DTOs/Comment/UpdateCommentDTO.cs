using FluentValidation;

namespace HotelBookingAPI.Data.DTOs.Comment
{
    public record class UpdateCommentDTO(string Text)
    {
        public class UpdateCommentDTOValidator : AbstractValidator<UpdateCommentDTO>
        {
            public UpdateCommentDTOValidator()
            {
                RuleFor(x => x.Text).NotEmpty().Length(min: 2, max: 100);
            }
        }
    }
}
