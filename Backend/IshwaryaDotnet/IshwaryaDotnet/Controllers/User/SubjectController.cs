using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Notes;
using IshwaryaDotnet.Models.Admin.Registration;
using IshwaryaDotnet.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.User
{
    [Route("api/user/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly IshDbContext _context;

        public SubjectController(IshDbContext context)
        {
            _context = context;
        }

        [HttpPost("from-notes")]
        public async Task<ActionResult<IEnumerable<UserSubject>>> GetSubjectsFromNotes([FromForm] string username, [FromForm] string password)
        {
            // Validate user login
            var student = await _context.Registrations
                .FirstOrDefaultAsync(s => s.UserName == username && s.Password == password);

            if (student == null)
                return Unauthorized("Invalid username or password");

            string course = student.Course;

            // Fetch distinct subjects from Notes where course matches
            var subjects = await _context.Notes
                .Where(n => n.Course == course && !string.IsNullOrEmpty(n.Subject))
                .Select(n => n.Subject)
                .Distinct()
                .ToListAsync();

            var result = subjects.Select(subject => new UserSubject
            {
                CourseName = course,
                SubjectName = subject
            }).ToList();

            return Ok(result);
        }
    }
}
