using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.QuestionAnswer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class QuestionAnswerController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public QuestionAnswerController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ GET: All Courses
        [HttpGet("courses")]
        public IActionResult GetCourses()
        {
            var courses = _context.Tests
                .Select(t => t.Course)
                .Distinct()
                .ToList();
            return Ok(courses);
        }

        // ✅ GET: TestNames by Course
        [HttpGet("testnames")]
        public IActionResult GetTestNames([FromQuery] string course)
        {
            var testNames = _context.Tests
                .Where(t => t.Course == course)
                .Select(t => t.TestName)
                .Distinct()
                .ToList();
            return Ok(testNames);
        }

        // ✅ GET: Subjects
        [HttpGet("subjects")]
        public IActionResult GetSubjects([FromQuery] string course, [FromQuery] string testName)
        {
            var subjects = _context.Tests
                .Where(t => t.Course == course && t.TestName == testName)
                .Select(t => t.Subject)
                .Distinct()
                .ToList();
            return Ok(subjects);
        }

        // ✅ GET: Topics
        [HttpGet("topics")]
        public IActionResult GetTopics([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject)
        {
            var topics = _context.Tests
                .Where(t => t.Course == course && t.TestName == testName && t.Subject == subject)
                .Select(t => t.Topic)
                .Distinct()
                .ToList();
            return Ok(topics);
        }

        // ✅ GET: TestNos
        [HttpGet("testnos")]
        public IActionResult GetTestNos([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject, [FromQuery] string topic)
        {
            var testNos = _context.Tests
                .Where(t => t.Course == course && t.TestName == testName && t.Subject == subject && t.Topic == topic)
                .Select(t => t.TestNo)
                .Distinct()
                .ToList();
            return Ok(testNos);
        }

        // ✅ GET: Languages
        [HttpGet("languages")]
        public IActionResult GetLanguages([FromQuery] string course, [FromQuery] string testName, [FromQuery] string subject, [FromQuery] string topic, [FromQuery] string testNo)
        {
            var languages = _context.Tests
                .Where(t => t.Course == course && t.TestName == testName && t.Subject == subject && t.Topic == topic && t.TestNo == testNo)
                .Select(t => t.Language)
                .Distinct()
                .ToList();
            return Ok(languages);
        }

        // ✅ POST: Upload Question/Answer Paper
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] QuestionAnswerUploadDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            string questionPath = null, answerPath = null;

            if (dto.QuestionFile != null)
            {
                questionPath = await SaveFile(dto.QuestionFile, "QuestionPapers");
            }
            if (dto.AnswerFile != null)
            {
                answerPath = await SaveFile(dto.AnswerFile, "AnswerPapers");
            }

            var qa = new QuestionAnswer
            {
                Type = dto.Type,
                Course = dto.Course,
                TestName = dto.TestName,
                Subject = dto.Subject,
                Topic = dto.Topic,
                TestNo = dto.TestNo,
                QuestionPaperPath = questionPath,
                AnswerPaperPath = answerPath,
                UploadedDate = DateTime.Now
            };

            _context.QuestionAnswers.Add(qa);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Saved successfully",
                questionPath,
                answerPath
            });
        }

        // ✅ POST: ExtractPdf (placeholder for future implementation)
        [HttpPost]
        public async Task<IActionResult> ExtractPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var tempPath = Path.Combine(_env.WebRootPath, "temp", Guid.NewGuid() + Path.GetExtension(file.FileName));
            Directory.CreateDirectory(Path.GetDirectoryName(tempPath));

            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var pdfPath = Path.ChangeExtension(tempPath, ".pdf");

            var pdfBytes = await System.IO.File.ReadAllBytesAsync(pdfPath);
            System.IO.File.Delete(tempPath);
            System.IO.File.Delete(pdfPath);
            return File(pdfBytes, "application/pdf", Path.GetFileName(pdfPath));
        }

        // ✅ Save file to wwwroot/uploads/...
        private async Task<string> SaveFile(IFormFile file, string folder)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folder);
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 👇 returns relative URL for React preview
            return $"uploads/{folder}/{fileName}".Replace("\\", "/");
        }

        // ✅ GET: Types
        [HttpGet("types")]
        public IActionResult GetTypes()
        {
            var types = _context.Tests
                .Select(t => t.Type)
                .Where(t => t == "Question" || t == "Answer")
                .Distinct()
                .ToList();
            return Ok(types);
        }
    }
}
