using IshwaryaDotnet.Models.Admin.Notes;
using IshwaryaDotnet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace IshwaryaDotnet.Controllers.Admin.Exams
{
    [ApiController]
    [Route("api/admin/exam/add")] // ✅ Swagger will expose as: POST /api/admin/exam/add
    public class AddExamController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AddExamController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Index(IshwaryaDotnet.Models.Admin.Notes.Exam exam)

        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ✅ Handle Video upload
            if (exam.VideoFile != null && exam.VideoFile.Length > 0)
            {
                var videoPath = Path.Combine("uploads", "Exam", "Video", exam.VideoFile.FileName);
                var savePath = Path.Combine(_env.WebRootPath, videoPath);
                Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await exam.VideoFile.CopyToAsync(stream);
                }

                exam.Video = "/" + videoPath.Replace("\\", "/");
            }

            // ✅ Handle PDF upload
            if (exam.PdfFile != null && exam.PdfFile.Length > 0)
            {
                var pdfPath = Path.Combine("uploads", "Exam", "Pdf", exam.PdfFile.FileName);
                var savePath = Path.Combine(_env.WebRootPath, pdfPath);
                Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await exam.PdfFile.CopyToAsync(stream);
                }

                exam.Pdf = "/" + pdfPath.Replace("\\", "/");
            }

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Exam added successfully", exam });
        }
    }
}
