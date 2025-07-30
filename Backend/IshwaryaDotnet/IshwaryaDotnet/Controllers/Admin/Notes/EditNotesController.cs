using IshwaryaDotnet.Data;
using NotesModelAlias = IshwaryaDotnet.Models.Admin.Notes.NotesModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Linq;

namespace IshwaryaDotnet.Controllers.Admin.Notes
{
    [ApiController]
    [Route("api/admin/notes/edit")]
    public class EditNotesController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EditNotesController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ PUT - Update note using Course + Subject + Topic
        [HttpPut]
        public async Task<IActionResult> UpdateNote([FromForm] NotesModelAlias updatedNote)
        {
            if (string.IsNullOrWhiteSpace(updatedNote.Course) ||
                string.IsNullOrWhiteSpace(updatedNote.Subject) ||
                string.IsNullOrWhiteSpace(updatedNote.Topic))
            {
                return BadRequest(new { message = "Course, Subject, and Topic are required." });
            }

            var note = await _context.Notes.FirstOrDefaultAsync(n =>
                n.Course == updatedNote.Course &&
                n.Subject == updatedNote.Subject &&
                n.Topic == updatedNote.Topic);

            if (note == null)
                return NotFound(new { message = "Note not found with the given Course, Subject, and Topic." });

            // Optional: update Mode
            note.Mode = updatedNote.Mode;

            // ✅ If new Video uploaded
            if (updatedNote.VideoFile != null)
            {
                var videoFileName = $"{Guid.NewGuid()}_{updatedNote.VideoFile.FileName}";
                var videoPath = Path.Combine(_env.WebRootPath, "uploads/Notes/VIDEO", videoFileName);
                using (var stream = new FileStream(videoPath, FileMode.Create))
                {
                    await updatedNote.VideoFile.CopyToAsync(stream);
                }
                note.VideoPath = $"/uploads/Notes/VIDEO/{videoFileName}";
            }

            // ✅ If new PDF uploaded
            if (updatedNote.PdfFile != null)
            {
                var pdfFileName = $"{Guid.NewGuid()}_{updatedNote.PdfFile.FileName}";
                var pdfPath = Path.Combine(_env.WebRootPath, "uploads/Notes/PDF", pdfFileName);
                using (var stream = new FileStream(pdfPath, FileMode.Create))
                {
                    await updatedNote.PdfFile.CopyToAsync(stream);
                }
                note.PdfPath = $"/uploads/Notes/PDF/{pdfFileName}";
            }

            _context.Notes.Update(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Note updated successfully." });
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
