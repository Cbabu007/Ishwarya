using Microsoft.AspNetCore.Mvc;
using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Notes;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Exams
{
    [ApiController]
    [Route("api/admin/exam/view")]
    public class ViewExamController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ViewExamController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ Fetch full exam details using 5 fields
        [HttpGet("fetch")]
        public async Task<IActionResult> GetExam([FromQuery] string course, [FromQuery] string testName,
                                                 [FromQuery] string subject, [FromQuery] string topic,
                                                 [FromQuery] string testNo)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == course &&
                e.TestName == testName &&
                e.Subject == subject &&
                e.Topic == topic &&
                e.TestNo == testNo);

            if (exam == null)
                return NotFound(new { message = "Exam not found." });

            return Ok(exam);
        }

        // ✅ Video Preview by 5 fields
        [HttpGet("preview/video")]
        public async Task<IActionResult> PreviewVideo([FromQuery] string course, [FromQuery] string testName,
                                                      [FromQuery] string subject, [FromQuery] string topic,
                                                      [FromQuery] string testNo)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == course &&
                e.TestName == testName &&
                e.Subject == subject &&
                e.Topic == topic &&
                e.TestNo == testNo);

            if (exam == null || string.IsNullOrWhiteSpace(exam.Video))
                return NotFound(new { message = "Video not found." });

            var filePath = Path.Combine(_env.WebRootPath, exam.Video.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
            return PhysicalFile(filePath, "video/mp4");
        }

        // ✅ PDF Preview by 5 fields
        [HttpGet("preview/pdf")]
        public async Task<IActionResult> PreviewPdf([FromQuery] string course, [FromQuery] string testName,
                                                    [FromQuery] string subject, [FromQuery] string topic,
                                                    [FromQuery] string testNo)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e =>
                e.Course == course &&
                e.TestName == testName &&
                e.Subject == subject &&
                e.Topic == topic &&
                e.TestNo == testNo);

            if (exam == null || string.IsNullOrWhiteSpace(exam.Pdf))
                return NotFound(new { message = "PDF not found." });

            var filePath = Path.Combine(_env.WebRootPath, exam.Pdf.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
            return PhysicalFile(filePath, "application/pdf");
        }

        // ✅ Get dropdown data for cascading selects
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses() =>
            Ok(await _context.Exams.Select(e => e.Course).Distinct().ToListAsync());

        [HttpGet("testnames")]
        public async Task<IActionResult> GetTestNames([FromQuery] string course) =>
            Ok(await _context.Exams.Where(e => e.Course == course).Select(e => e.TestName).Distinct().ToListAsync());

        [HttpGet("subjects")]
        public async Task<IActionResult> GetSubjects([FromQuery] string course, [FromQuery] string testName) =>
            Ok(await _context.Exams
                .Where(e => e.Course == course && e.TestName == testName)
                .Select(e => e.Subject)
                .Distinct()
                .ToListAsync());

        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject) =>
            Ok(await _context.Exams
                .Where(e => e.Course == course && e.TestName == testName && e.Subject == subject)
                .Select(e => e.Topic)
                .Distinct()
                .ToListAsync());

        [HttpGet("testnos")]
        public async Task<IActionResult> GetTestNos([FromQuery] string course, [FromQuery] string testName,
                                                    [FromQuery] string subject, [FromQuery] string topic) =>
            Ok(await _context.Exams
                .Where(e => e.Course == course && e.TestName == testName && e.Subject == subject && e.Topic == topic)
                .Select(e => e.TestNo)
                .Distinct()
                .ToListAsync());
    }
}
