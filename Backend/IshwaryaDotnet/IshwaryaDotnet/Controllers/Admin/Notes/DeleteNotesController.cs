using IshwaryaDotnet.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Notes
{
    [ApiController]
    [Route("api/admin/notes/delete")]
    public class DeleteNotesController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DeleteNotesController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ DELETE - by Course + Subject + Topic
        [HttpDelete]
        public async Task<IActionResult> DeleteNoteBySelection(
            [FromQuery] string course,
            [FromQuery] string subject,
            [FromQuery] string topic)
        {
            if (string.IsNullOrWhiteSpace(course) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(topic))
                return BadRequest(new { message = "Course, Subject, and Topic are required." });

            var note = await _context.Notes.FirstOrDefaultAsync(n =>
                n.Course == course &&
                n.Subject == subject &&
                n.Topic == topic);

            if (note == null)
                return NotFound(new { message = "Note not found for the given selection." });

            // Delete Video file
            if (!string.IsNullOrEmpty(note.VideoPath))
            {
                var videoFullPath = Path.Combine(_env.WebRootPath, note.VideoPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(videoFullPath))
                    System.IO.File.Delete(videoFullPath);
            }

            // Delete PDF file
            if (!string.IsNullOrEmpty(note.PdfPath))
            {
                var pdfFullPath = Path.Combine(_env.WebRootPath, note.PdfPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(pdfFullPath))
                    System.IO.File.Delete(pdfFullPath);
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Note deleted successfully based on course, subject, and topic." });
        }

        // ✅ GET: All Courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Notes
                .Select(n => n.Course)
                .Distinct()
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ GET: Subjects by Course
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

        // ✅ GET: Topics by Course + Subject
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
