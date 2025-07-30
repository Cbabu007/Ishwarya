using IshwaryaDotnet.Data;
using IshwaryaDotnet.Model.User;
using IshwaryaDotnet.Models.Admin.Notes;
using IshwaryaDotnet.Models.Admin.Registration;
using IshwaryaDotnet.Models.Admin.Test;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.User
{
    [Route("api/user/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IshDbContext _context;

        public CourseController(IshDbContext context)
        {
            _context = context;
        }

        [HttpPost("by-login")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesByLogin([FromForm] string username, [FromForm] string password)
        {
            var student = await _context.Registrations
                .FirstOrDefaultAsync(x => x.UserName == username && x.Password == password);

            if (student == null)
                return Unauthorized("Invalid credentials");

            var courseName = student.Course;

            // Get courses from Exam
            var exams = await _context.Exams
                .Where(e => e.Course == courseName)
                .Select(e => new Course
                {
                    CourseName = e.Course,
                    TestName = e.TestName,
                    Subject = e.Subject,
                    Topic = e.Topic,
                    TestNo = e.TestNo
                }).ToListAsync();

            // Get courses from Test
            var tests = await _context.Tests
                .Where(t => t.Course == courseName)
                .Select(t => new Course
                {
                    CourseName = t.Course,
                    TestName = t.TestName,
                    Subject = t.Subject,
                    Topic = t.Topic,
                    TestNo = t.TestNo
                }).ToListAsync();

            // Combine and remove duplicates
            var all = exams.Concat(tests)
                .GroupBy(c => new { c.CourseName, c.TestName, c.Subject, c.Topic, c.TestNo })
                .Select(g => g.First())
                .ToList();

            return Ok(all);
        }
    }
}
