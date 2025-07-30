using Microsoft.AspNetCore.Mvc;
using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Registration;

namespace IshwaryaDotnet.Controllers.Admin.Registration
{
    [ApiController]
    [Route("api/admin/registration/add")]
    public class AddRegistrationController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AddRegistrationController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent([FromForm] IshwaryaDotnet.Models.Admin.Registration.Registration model)

        {
            // ✅ Save photo
            if (model.Photo != null && model.Photo.Length > 0)
            {
                var photoFileName = $"{Guid.NewGuid()}_{model.Photo.FileName}";
                var photoPath = Path.Combine(_env.WebRootPath, "uploads/photos", photoFileName);
                using (var stream = new FileStream(photoPath, FileMode.Create))
                {
                    await model.Photo.CopyToAsync(stream);
                }
                model.PhotoPath = $"/uploads/photos/{photoFileName}";
            }

            // ✅ Save aadhar
            if (model.UploadAadhar != null && model.UploadAadhar.Length > 0)
            {
                var aadharFileName = $"{Guid.NewGuid()}_{model.UploadAadhar.FileName}";
                var aadharPath = Path.Combine(_env.WebRootPath, "uploads/aadhars", aadharFileName);
                using (var stream = new FileStream(aadharPath, FileMode.Create))
                {
                    await model.UploadAadhar.CopyToAsync(stream);
                }
                model.AadharPath = $"/uploads/aadhars/{aadharFileName}";
            }

            // ✅ Generate ID
            if (string.IsNullOrWhiteSpace(model.Id))
            {
                model.Id = $"STD{DateTime.Now.Ticks}";
            }

            // ✅ Save the full record
            _context.Registrations.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student registered successfully.",
                id = model.Id
            });
        }
    }
}
