using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Notes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Notes
{
    [ApiController]
    [Route("api/admin/notes/add")]
    public class AddNotesController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AddNotesController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> AddNotes([FromForm] NotesModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid form data", errors = ModelState });

                // Ensure folders exist
                string rootPath = _env.WebRootPath;
                string videoFolder = Path.Combine(rootPath, "uploads", "Notes", "VIDEO");
                string pdfFolder = Path.Combine(rootPath, "uploads", "Notes", "PDF");

                Directory.CreateDirectory(videoFolder);
                Directory.CreateDirectory(pdfFolder);

                // Save Video
                if (model.VideoFile != null)
                {
                    string videoFileName = $"{Guid.NewGuid()}_{model.VideoFile.FileName}";
                    string fullVideoPath = Path.Combine(videoFolder, videoFileName);

                    using (var stream = new FileStream(fullVideoPath, FileMode.Create))
                    {
                        await model.VideoFile.CopyToAsync(stream);
                    }

                    model.VideoPath = $"/uploads/Notes/VIDEO/{videoFileName}";
                }

                // Save PDF
                if (model.PdfFile != null)
                {
                    string pdfFileName = $"{Guid.NewGuid()}_{model.PdfFile.FileName}";
                    string fullPdfPath = Path.Combine(pdfFolder, pdfFileName);

                    using (var stream = new FileStream(fullPdfPath, FileMode.Create))
                    {
                        await model.PdfFile.CopyToAsync(stream);
                    }

                    model.PdfPath = $"/uploads/Notes/PDF/{pdfFileName}";
                }

                // Save to database
                model.Id = Guid.NewGuid();
                await _context.Notes.AddAsync(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Class content added successfully." });
            }
            catch (Exception ex)
            {
                // Prevent server crash and return error
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
