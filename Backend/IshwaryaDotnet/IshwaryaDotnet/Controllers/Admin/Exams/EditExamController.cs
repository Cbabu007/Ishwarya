using IshwaryaDotnet.Data;
using ExamModelAlias = IshwaryaDotnet.Models.Admin.Notes.Exam;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Linq;

namespace IshwaryaDotnet.Controllers.Admin.Exams
{
    [ApiController]
    [Route("api/admin/exam/edit")]
    public class EditExamController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EditExamController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ PUT: Update exam without ID
        [HttpPut]
        public async Task<IActionResult> UpdateExam([FromForm] ExamModelAlias updatedExam)
        {
            if (string.IsNullOrWhiteSpace(updatedExam.Course) ||
                string.IsNullOrWhiteSpace(updatedExam.TestName) ||
                string.IsNullOrWhiteSpace(updatedExam.Subject) ||
                string.IsNullOrWhiteSpace(updatedExam.Topic) ||
                string.IsNullOrWhiteSpace(updatedExam.TestNo))
            {
                return BadRequest(new { message = "Course, TestName, Subject, Topic, and TestNo are required." });
            }

            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == updatedExam.Course &&
                e.TestName == updatedExam.TestName &&
                e.Subject == updatedExam.Subject &&
                e.Topic == updatedExam.Topic &&
                e.TestNo == updatedExam.TestNo);

            if (exam == null)
                return NotFound(new { message = "Exam not found." });

            // ✅ Update video
            if (updatedExam.VideoFile != null)
            {
                var videoFileName = $"{Guid.NewGuid()}_{updatedExam.VideoFile.FileName}";
                var videoPath = Path.Combine(_env.WebRootPath, "uploads/Exam/Video", videoFileName);
                Directory.CreateDirectory(Path.GetDirectoryName(videoPath)!);
                using (var stream = new FileStream(videoPath, FileMode.Create))
                    await updatedExam.VideoFile.CopyToAsync(stream);

                exam.Video = $"/uploads/Exam/Video/{videoFileName}";
            }

            // ✅ Update PDF
            if (updatedExam.PdfFile != null)
            {
                var pdfFileName = $"{Guid.NewGuid()}_{updatedExam.PdfFile.FileName}";
                var pdfPath = Path.Combine(_env.WebRootPath, "uploads/Exam/Pdf", pdfFileName);
                Directory.CreateDirectory(Path.GetDirectoryName(pdfPath)!);
                using (var stream = new FileStream(pdfPath, FileMode.Create))
                    await updatedExam.PdfFile.CopyToAsync(stream);

                exam.Pdf = $"/uploads/Exam/Pdf/{pdfFileName}";
            }

            _context.Exams.Update(exam);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Exam updated successfully." });
        }

        // ✅ GET: Video Preview by 5 fields
        [HttpGet("preview/video")]
        public async Task<IActionResult> PreviewVideo([FromQuery] string course, [FromQuery] string testName,
                                                      [FromQuery] string subject, [FromQuery] string topic,
                                                      [FromQuery] string testNo)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == course && e.TestName == testName &&
                e.Subject == subject && e.Topic == topic &&
                e.TestNo == testNo);

            if (exam == null || string.IsNullOrWhiteSpace(exam.Video))
                return NotFound(new { message = "Video not found." });

            var path = Path.Combine(_env.WebRootPath, exam.Video.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
            return PhysicalFile(path, "video/mp4");
        }

        // ✅ GET: PDF Preview by 5 fields
        [HttpGet("preview/pdf")]
        public async Task<IActionResult> PreviewPdf([FromQuery] string course, [FromQuery] string testName,
                                                    [FromQuery] string subject, [FromQuery] string topic,
                                                    [FromQuery] string testNo)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == course && e.TestName == testName &&
                e.Subject == subject && e.Topic == topic &&
                e.TestNo == testNo);

            if (exam == null || string.IsNullOrWhiteSpace(exam.Pdf))
                return NotFound(new { message = "PDF not found." });

            var path = Path.Combine(_env.WebRootPath, exam.Pdf.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
            return PhysicalFile(path, "application/pdf");
        }

        // ✅ GET: Dropdown Cascading
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses() =>
            Ok(await _context.Exams.Select(e => e.Course).Distinct().ToListAsync());

        [HttpGet("testnames")]
        public async Task<IActionResult> GetTestNames([FromQuery] string course) =>
            Ok(await _context.Exams.Where(e => e.Course == course).Select(e => e.TestName).Distinct().ToListAsync());

        [HttpGet("subjects")]
        public async Task<IActionResult> GetSubjects([FromQuery] string course, [FromQuery] string testName) =>
            Ok(await _context.Exams.Where(e => e.Course == course && e.TestName == testName).Select(e => e.Subject).Distinct().ToListAsync());

        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject) =>
            Ok(await _context.Exams.Where(e => e.Course == course && e.TestName == testName && e.Subject == subject).Select(e => e.Topic).Distinct().ToListAsync());

        [HttpGet("testnos")]
        public async Task<IActionResult> GetTestNos([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject, [FromQuery] string topic) =>
            Ok(await _context.Exams.Where(e => e.Course == course && e.TestName == testName && e.Subject == subject && e.Topic == topic).Select(e => e.TestNo).Distinct().ToListAsync());
    }
}
