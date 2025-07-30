using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Registration;

namespace IshwaryaDotnet.Controllers.Login
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserLoginController : ControllerBase
    {
        private readonly IshDbContext _context;

        public UserLoginController(IshDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] string username, [FromForm] string password)
        {
            var user = await _context.Registrations
                .FirstOrDefaultAsync(u => u.UserName == username && u.Password == password);

            if (user == null)
            {
                return Unauthorized(new { status = "error", message = "Invalid username or password" });
            }

            string role = user.Role?.Trim().ToLower() ?? "";
            string course = user.Course?.Trim().ToLower() ?? "";
            string redirectUrl = "";

            if (role == "admin" || role == "teacher")
            {
                redirectUrl = "http://localhost:5173/admin/students";
            }
            else if (role == "student")
            {
                redirectUrl = "http://localhost:5173/user/dashboard";
            }
            else
            {
                // fallback if role is missing
                redirectUrl = "http://localhost:5173/user/dashboard";
            }

            return Ok(new
            {
                status = "success",
                username = user.UserName,
                role = user.Role,
                course = user.Course,
                firstName = user.FirstName,
                middleName = user.MiddleName,
                lastName = user.LastName,
                photo = user.PhotoPath != null
         ? "/uploads/photos/" + Path.GetFileName(user.PhotoPath)
         : "",
                redirectUrl = redirectUrl
            });

        }
    }
}
