﻿using HotelBookingAPI.Auth.Model;

namespace HotelBookingAPI.Data.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public required int RoomId { get; set; }
        public Room Room { get; set; }

        public required string UserId { get; set; }
        public HotelUser User { get; set; }
    }
}
