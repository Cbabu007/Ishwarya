using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Test;

namespace IshwaryaDotnet.Controllers.Admin.Tests
{
    [ApiController]
    [Route("api/admin/tests/edit")]
    public class EditTestController : ControllerBase
    {
        private readonly IshDbContext _context;

        public EditTestController(IshDbContext context)
        {
            _context = context;
        }

        // ✅ 1. Get all dropdown values from Test table
        [HttpGet("dropdowns")]
        public async Task<IActionResult> GetDropdownValues()
        {
            var tests = await _context.Tests.ToListAsync();

            var dropdowns = new
            {
                courses = tests.Select(t => t.Course).Distinct().ToList(),
                testNames = tests.Select(t => t.TestName).Distinct().ToList(),
                subjects = tests.Select(t => t.Subject).Distinct().ToList(),
                topics = tests.Select(t => t.Topic).Distinct().ToList(),
                testNos = tests.Select(t => t.TestNo).Distinct().ToList(),
                languages = tests.Select(t => t.Language).Distinct().ToList(),
                timings = tests.Select(t => t.Timing).Distinct().ToList()
            };

            return Ok(dropdowns);
        }

        // ✅ 2. Get all matching records by selected dropdown values
        [HttpPost("get")]
        public async Task<IActionResult> GetBySelections([FromBody] SelectionRequest request)
        {
            var tests = await _context.Tests
                .Where(t =>
                    t.Course == request.Course &&
                    t.TestName == request.TestName &&
                    t.Subject == request.Subject &&
                    t.Topic == request.Topic &&
                    t.TestNo == request.TestNo &&
                    t.Language == request.Language)
                .OrderBy(t => t.QuestionNo)
                .ToListAsync();

            if (tests == null || tests.Count == 0)
                return NotFound(new { message = "No record found for selection." });

            return Ok(tests);
        }

        // ✅ 3. Update that record using same selection combo
        [HttpPut("update")]
        public async Task<IActionResult> UpdateBySelection([FromBody] EditTestRequest request)
        {
            var test = await _context.Tests.FirstOrDefaultAsync(t =>
                t.Course == request.Selection.Course &&
                t.TestName == request.Selection.TestName &&
                t.Subject == request.Selection.Subject &&
                t.Topic == request.Selection.Topic &&
                t.TestNo == request.Selection.TestNo &&
                t.Language == request.Selection.Language &&
                t.QuestionNo == request.QuestionNo);

            if (test == null)
                return NotFound(new { message = "Test not found for update." });

            // ✅ Update only if editable
            if (request.Editable.TestNo) test.TestNo = request.TestNo;
            if (request.Editable.Date) test.Date = request.Date;
            if (request.Editable.QuestionNo) test.QuestionNo = request.QuestionNo;
            if (request.Editable.Question) test.Question = request.Question;
            if (request.Editable.Type) test.Type = request.Type;
            if (request.Editable.OptionA) test.OptionA = request.OptionA;
            if (request.Editable.OptionB) test.OptionB = request.OptionB;
            if (request.Editable.OptionC) test.OptionC = request.OptionC;
            if (request.Editable.OptionD) test.OptionD = request.OptionD;
            if (request.Editable.Answer) test.Answer = request.Answer;
            test.Timing = request.Timing;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Test updated successfully." });
        }
    }

    // 👇 Request to select a record
    public class SelectionRequest
    {
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }
        public string Language { get; set; }
    }

    // 👇 Request to update a record
    public class EditTestRequest
    {
        public SelectionRequest Selection { get; set; } // Used to find row

        public string TestNo { get; set; }
        public DateTime Date { get; set; }
        public string QuestionNo { get; set; }
        public string Question { get; set; }
        public string Type { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string Answer { get; set; }
        public string Timing { get; set; }

        public EditableFlags Editable { get; set; } = new EditableFlags();
    }

    public class EditableFlags
    {
        public bool TestNo { get; set; }
        public bool Date { get; set; }
        public bool QuestionNo { get; set; }
        public bool Question { get; set; }
        public bool Type { get; set; }
        public bool OptionA { get; set; }
        public bool OptionB { get; set; }
        public bool OptionC { get; set; }
        public bool OptionD { get; set; }
        public bool Answer { get; set; }
    }
}