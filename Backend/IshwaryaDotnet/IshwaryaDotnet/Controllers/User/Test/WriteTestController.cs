using IshwaryaDotnet.Data;
using IshwaryaDotnet.Model.User;
using IshwaryaDotnet.Models.User;
using IshwaryaDotnet.Models; // Add this line
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.User.Test
{
    [ApiController]
    [Route("api/user/[controller]")]
    public class WriteTestController : ControllerBase
    {
        private readonly IshDbContext _context;

        public WriteTestController(IshDbContext context)
        {
            _context = context;
        }

        [HttpPost("by-login")]
        public async Task<IActionResult> GetTestsByLogin([FromForm] string username, [FromForm] string password)
        {
            var student = await _context.Registrations
                .FirstOrDefaultAsync(x => x.UserName == username && x.Password == password);

            if (student == null)
                return Unauthorized("Invalid credentials");

            var course = student.Course;

            var tests = await _context.Tests
                .Where(t => t.Course == course)
                .ToListAsync();

            return Ok(tests);
        }
        [HttpPost("save-answer")]
        public async Task<IActionResult> SaveAnswer([FromForm] Answer answer)
        {
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return Ok("Answer saved");
        }

        [HttpPost("save-result")]
        public async Task<IActionResult> SaveResult([FromForm] ResultSummary result)
        {
            _context.ResultSummaries.Add(result);
            await _context.SaveChangesAsync();
            return Ok("Result saved successfully");
        }

        [HttpPost("fetch-review")]
        public async Task<IActionResult> FetchReview([FromForm] string testName, [FromForm] string testNo, [FromForm] string username)
        {
            var questions = await _context.Test
                .Where(q => q.TestName == testName && q.TestNo == testNo)
                .OrderBy(q => q.QuestionNo)
                .ToListAsync();

            var answers = await _context.Answers  // ✅ Must be `Answers`, not `Answer`
                .Where(a => a.TestName == testName && a.TestNo == int.Parse(testNo) && a.Username == username)
                .ToListAsync();

            var review = questions.Select(q =>
            {
                var a = answers.FirstOrDefault(x => x.QuestionNo.ToString() == q.QuestionNo);
                return new
                {
                    q.QuestionNo,
                    q.Question,
                    q.OptionA,
                    q.OptionB,
                    q.OptionC,
                    q.OptionD,
                    CorrectAnswer = q.Answer,
                    GivenAnswer = a?.AnswerText ?? "E" // E = Not Answered
                };
            });

            return Ok(review);
        }
        [HttpPost("get-papers")]
        public async Task<IActionResult> GetQuestionAnswerPaper([FromForm] string testName, [FromForm] string subject, [FromForm] string topic, [FromForm] string testNo)
        {
            var result = await _context.QuestionAnswers
                .Where(q => q.TestName == testName && q.Subject == subject && q.Topic == topic && q.TestNo == testNo)
                .Select(q => new
                {
                    questionPdf = q.QuestionPaperPath,
                    answerPdf = q.AnswerPaperPath
                })
                .FirstOrDefaultAsync();

            if (result == null)
                return NotFound("No PDF found");

            return Ok(result);
        }

        [HttpPost("get-exam-video")]
        public async Task<IActionResult> GetExamVideo([FromForm] string course, [FromForm] string testName, [FromForm] string subject, [FromForm] string topic, [FromForm] string testNo)
        {
            var exam = await _context.Exams
                .FirstOrDefaultAsync(e =>
                    e.Course == course &&
                    e.TestName == testName &&
                    e.Subject == subject &&
                    e.Topic == topic &&
                    e.TestNo == testNo);

            if (exam == null || string.IsNullOrEmpty(exam.Video))
                return NotFound("No video found for this exam.");

            return Ok(new { video = exam.Video });
        }
    }
}
