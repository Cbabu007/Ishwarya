using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IshwaryaDotnet.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Alias to avoid conflict with namespace
using RegistrationModel = IshwaryaDotnet.Models.Admin.Registration.Registration;

namespace IshwaryaDotnet.Controllers.Admin.Registration
{
    [ApiController]
    [Route("api/admin/registration/view")]
    public class ViewRegistrationController : ControllerBase
    {
        private readonly IshDbContext _context;

        public ViewRegistrationController(IshDbContext context)
        {
            _context = context;
        }

        // ✅ GET: /api/admin/registration/view/by-id/{id}
        [HttpGet("by-id/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "ID is required." });

            var student = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == id);

            if (student == null)
                return NotFound(new { message = "Student not found." });

            var qualifications = ExtractQualifications(student);

            return Ok(new
            {
                Student = student,
                Qualifications = qualifications
            });
        }

        // ✅ GET: /api/admin/registration/view/by-course/{course}
        [HttpGet("by-course/{course}")]
        public async Task<IActionResult> GetByCourse(string course)
        {
            if (string.IsNullOrWhiteSpace(course))
                return BadRequest(new { message = "Course is required." });

            var students = await _context.Registrations
                .Where(r => r.Course == course)
                .ToListAsync();

            var result = students.Select(s => new
            {
                Student = s,
                Qualifications = ExtractQualifications(s)
            }).ToList();

            return Ok(result);
        }

        // ✅ Extract DegreeType1–10 etc.
        private List<Dictionary<string, string>> ExtractQualifications(RegistrationModel r)
        {
            var qualifications = new List<Dictionary<string, string>>();

            for (int i = 1; i <= 10; i++)
            {
                var type = r.GetType().GetProperty($"DegreeType{i}")?.GetValue(r)?.ToString();
                var name = r.GetType().GetProperty($"DegreeName{i}")?.GetValue(r)?.ToString();
                var institute = r.GetType().GetProperty($"InstituteName{i}")?.GetValue(r)?.ToString();
                var year = r.GetType().GetProperty($"YearPassedOut{i}")?.GetValue(r)?.ToString();

                if (!string.IsNullOrWhiteSpace(type) ||
                    !string.IsNullOrWhiteSpace(name) ||
                    !string.IsNullOrWhiteSpace(institute) ||
                    !string.IsNullOrWhiteSpace(year))
                {
                    qualifications.Add(new Dictionary<string, string>
                    {
                        { "DegreeType", type ?? "" },
                        { "DegreeName", name ?? "" },
                        { "InstituteName", institute ?? "" },
                        { "YearPassedOut", year ?? "" }
                    });
                }
            }

            return qualifications;
        }
    }
}
