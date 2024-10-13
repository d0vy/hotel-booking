using HotelBookingAPI.Data.DTOs.Comment;
using HotelBookingAPI.Data.Entities;

namespace HotelBookingAPI.Data.Mappers
{
    public static class CommentMappers
    {
        public static CommentDTO ToCommentDTO(this Comment comment)
        {
            return new CommentDTO(comment.Id, comment.Text, comment.CreatedAt);
        }
    }
}
