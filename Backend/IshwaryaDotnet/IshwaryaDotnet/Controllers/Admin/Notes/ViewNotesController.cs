using IshwaryaDotnet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Notes
{
    [ApiController]
    [Route("api/admin/notes/view")]
    public class ViewNotesController : ControllerBase
    {
        private readonly IshDbContext _context;

        public ViewNotesController(IshDbContext context)
        {
            _context = context;
        }

        // ✅ GET - View full note by selection
        [HttpGet("by-selection")]
        public async Task<IActionResult> GetNoteBySelection(
            [FromQuery] string course,
            [FromQuery] string subject,
            [FromQuery] string topic)
        {
            if (string.IsNullOrEmpty(course) || string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(topic))
            {
                return BadRequest(new { message = "Course, Subject, and Topic are required." });
            }

            var note = await _context.Notes.FirstOrDefaultAsync(n =>
                n.Course == course &&
                n.Subject == subject &&
                n.Topic == topic);

            if (note == null)
                return NotFound(new { message = "Note not found for the given selection." });

            return Ok(note); // includes PDF and VideoPath
        }

        // ✅ GET - All unique Courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Notes
                .Select(n => n.Course)
                .Distinct()
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ GET - Subjects by Course
        [HttpGet("subjects")]
        public async Task<IActionResult> GetSubjects([FromQuery] string course)
        {
            if (string.IsNullOrWhiteSpace(course))
                return BadRequest(new { message = "Course is required." });

            var subjects = await _context.Notes
                .Where(n => n.Course == course)
                .Select(n => n.Subject)
                .Distinct()
                .ToListAsync();

            return Ok(subjects);
        }

        // ✅ GET - Topics by Course + Subject
        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics([FromQuery] string course, [FromQuery] string subject)
        {
            if (string.IsNullOrWhiteSpace(course) || string.IsNullOrWhiteSpace(subject))
                return BadRequest(new { message = "Course and Subject are required." });

            var topics = await _context.Notes
                .Where(n => n.Course == course && n.Subject == subject)
                .Select(n => n.Topic)
                .Distinct()
                .ToListAsync();

            return Ok(topics);
        }
    }
}
