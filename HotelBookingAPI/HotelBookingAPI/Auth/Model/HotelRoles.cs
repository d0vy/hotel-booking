namespace HotelBookingAPI.Auth.Model
{
    public class HotelRoles
    {
        public const string Admin = nameof(Admin);
        public const string HotelUser = nameof(HotelUser);

        public static readonly IReadOnlyCollection<string> All = new[] { Admin, HotelUser };
    }
}
