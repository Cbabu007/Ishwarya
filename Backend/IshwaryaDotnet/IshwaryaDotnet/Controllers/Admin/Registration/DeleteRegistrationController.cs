using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IshwaryaDotnet.Data;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Registration
{
    [ApiController]
    [Route("api/admin/registration/delete")]
    public class DeleteRegistrationController : ControllerBase
    {
        private readonly IshDbContext _context;

        public DeleteRegistrationController(IshDbContext context)
        {
            _context = context;
        }

        // ✅ DELETE: /api/admin/registration/delete/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "ID is required." });

            var student = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == id);

            if (student == null)
                return NotFound(new { message = "Student not found." });

            _context.Registrations.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student deleted successfully." });
        }
    }
}
