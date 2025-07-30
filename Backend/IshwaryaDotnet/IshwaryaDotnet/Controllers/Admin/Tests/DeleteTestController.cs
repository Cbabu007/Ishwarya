using Microsoft.AspNetCore.Mvc;
using IshwaryaDotnet.Data;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace IshwaryaDotnet.Controllers.Admin.Tests
{
    [ApiController]
    [Route("api/admin/tests/delete")]
    public class DeleteTestController : ControllerBase
    {
        private readonly IshDbContext _context;

        public DeleteTestController(IshDbContext context)
        {
            _context = context;
        }

        // 🔴 POST: api/admin/tests/delete/bulk
        [HttpPost("bulk")]
        public async Task<IActionResult> DeleteBulk([FromBody] DeleteRequest req)
        {
            if (req == null)
                return BadRequest(new { message = "Invalid request." });

            var toDelete = await _context.Tests
                .Where(t =>
                    t.Course == req.Course &&
                    t.TestName == req.TestName &&
                    t.Subject == req.Subject &&
                    t.Topic == req.Topic &&
                    t.TestNo == req.TestNo &&
                    t.Language == req.Language)
                .ToListAsync();

            if (toDelete == null || !toDelete.Any())
                return NotFound(new { message = "No matching questions found." });

            _context.Tests.RemoveRange(toDelete);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{toDelete.Count} question(s) deleted successfully." });
        }
    }

    public class DeleteRequest
    {
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }
        public string Language { get; set; }
    }
}
