using FluentValidation;

namespace HotelBookingAPI.Data.DTOs.Comment
{
    public record class CommentDTO(int Id, string Text, DateTimeOffset CreatedAt, string UserName)
    {
        public class CommentDTOValidator : AbstractValidator<CommentDTO>
        {
            public CommentDTOValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.Text).NotEmpty().Length(min: 2, max: 100);
                RuleFor(x => x.CreatedAt).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
            }
        }
    }
}
