
using HotelBookingAPI.Auth.Model;
using Microsoft.AspNetCore.Identity;

namespace HotelBookingAPI.Auth
{
    public class AuthSeeder
    {
        private readonly UserManager<HotelUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthSeeder(UserManager<HotelUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            await AddDefaultRolesAsync();
            await AddAdminUserAsync();
        }

        private async Task AddAdminUserAsync()
        {
            var newAdminUser = new HotelUser()
            {
                UserName = "admin",
                Email = "admin123@admin.com"
            };

            var existingAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (existingAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "adminPass123!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(newAdminUser, HotelRoles.All);
                }
            }
        }

        private async Task AddDefaultRolesAsync()
        {
            foreach (var role in HotelRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
