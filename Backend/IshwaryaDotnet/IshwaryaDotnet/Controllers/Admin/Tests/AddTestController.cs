using Microsoft.AspNetCore.Mvc;
using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Test;

namespace IshwaryaDotnet.Controllers.Admin.Tests
{
    [ApiController]
    [Route("api/admin/tests/add")]
    public class AddTestController : Controller
    {
        private readonly IshDbContext _context;

        public AddTestController(IshDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddTest([FromBody] Test model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                model.Id = Guid.NewGuid(); // Ensure ID is unique
                _context.Tests.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Test added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving test.", error = ex.Message });
            }
        }
    }
}
