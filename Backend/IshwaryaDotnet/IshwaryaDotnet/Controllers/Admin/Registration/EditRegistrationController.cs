using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IshwaryaDotnet.Data;
using RegistrationModel = IshwaryaDotnet.Models.Admin.Registration.Registration;
using System.IO;

namespace IshwaryaDotnet.Controllers.Admin.Registration
{
    [ApiController]
    [Route("api/admin/registration/edit")]
    public class EditRegistrationController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EditRegistrationController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ GET: Fetch student by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(string id)
        {
            var student = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);

            if (student == null)
                return NotFound(new { message = "Student not found." });

            return Ok(student);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, [FromForm] RegistrationModel model)
        {
            var student = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);
            if (student == null)
                return NotFound(new { message = "Student not found." });

            // ✅ Update all normal fields
            _context.Entry(student).CurrentValues.SetValues(model);

            // ✅ Only overwrite if a new photo is provided
            if (model.Photo != null && model.Photo.Length > 0)
            {
                var photoFileName = $"{Guid.NewGuid()}_{model.Photo.FileName}";
                var photoPath = Path.Combine("uploads", "photos", photoFileName);
                Directory.CreateDirectory(Path.GetDirectoryName(photoPath)!);
                using (var stream = new FileStream(photoPath, FileMode.Create))
                {
                    await model.Photo.CopyToAsync(stream);
                }
                student.PhotoPath = $"/uploads/photos/{photoFileName}";
            }
            // ❌ DO NOT touch student.PhotoPath if model.Photo is null

            // ✅ Only overwrite if a new aadhar is provided
            if (model.UploadAadhar != null && model.UploadAadhar.Length > 0)
            {
                var aadharFileName = $"{Guid.NewGuid()}_{model.UploadAadhar.FileName}";
                var aadharPath = Path.Combine("uploads", "aadhars", aadharFileName);
                Directory.CreateDirectory(Path.GetDirectoryName(aadharPath)!);
                using (var stream = new FileStream(aadharPath, FileMode.Create))
                {
                    await model.UploadAadhar.CopyToAsync(stream);
                }
                student.AadharPath = $"/uploads/aadhars/{aadharFileName}";
            }
            // ❌ DO NOT touch student.AadharPath if UploadAadhar is null

            await _context.SaveChangesAsync();

            return Ok(new { message = "Student updated successfully." });
        }

    }
}
