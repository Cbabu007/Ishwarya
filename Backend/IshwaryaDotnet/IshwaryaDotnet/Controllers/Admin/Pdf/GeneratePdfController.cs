using IshwaryaDotnet.Data;
using IshwaryaDotnet.Models.Admin.Class;
using IshwaryaDotnet.Models.Admin.Test; // Assuming Test.cs is under this namespace
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;
using PdfSharpCore.Drawing.Layout;


namespace IshwaryaDotnet.Controllers.Admin.Pdf
{
    [ApiController]
    [Route("api/admin/pdf/generate")]
    public class GeneratePdfController : ControllerBase
    {
        private readonly IshDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GeneratePdfController(IshDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] PdfRequestModel request)
        {
            var query = _context.Test.AsQueryable();

            query = query.Where(t =>
                t.Course == request.Course &&
                t.TestName == request.TestName &&
                t.Type == request.Type &&
                t.Language == request.Language &&
                t.Date >= request.FromDate &&
                t.Date <= request.EndDate
            );

            var questions = await query
                .OrderBy(t => t.QuestionNo)
                .ToListAsync();

            if (questions.Count == 0)
                return NotFound("No data found.");

            var document = new PdfDocument();
            var page = document.AddPage();
            var gfx = XGraphics.FromPdfPage(page);
            var tf = new XTextFormatter(gfx);
            var fontPath = Path.Combine(_env.WebRootPath, "NotoSansTamil-Regular.ttf");
            var font = new XFont("NotoSansTamil", 14);

            double y = 40;

            foreach (var q in questions)
            {
                if (y > page.Height - 100)
                {
                    page = document.AddPage();
                    gfx = XGraphics.FromPdfPage(page);
                    tf = new XTextFormatter(gfx);
                    y = 40;
                }

                tf.DrawString($"Q{q.QuestionNo}: {q.Question}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 40));
                y += 30;

                if (q.Type == "Horizontal")
                {
                    tf.DrawString($"A) {q.OptionA}   B) {q.OptionB}   C) {q.OptionC}   D) {q.OptionD}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 40));
                    y += 30;
                }
                else if (q.Type == "Vertical")
                {
                    tf.DrawString($"A) {q.OptionA}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 20)); y += 20;
                    tf.DrawString($"B) {q.OptionB}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 20)); y += 20;
                    tf.DrawString($"C) {q.OptionC}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 20)); y += 20;
                    tf.DrawString($"D) {q.OptionD}", font, XBrushes.Black, new XRect(40, y, page.Width - 80, 20)); y += 30;
                }

                y += 10;
            }

            var filename = $"pdf_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            var folderPath = Path.Combine(_env.WebRootPath, "uploads", "pdfs");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, filename);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                document.Save(stream);
            }

            var pdfRecord = new IshwaryaDotnet.Models.Admin.Class.Pdf
            {
                TestName = request.TestName,
                Type = request.Type,
                Language = request.Language,
                FromDate = request.FromDate,
                EndDate = request.EndDate,
                PdfPath = $"/uploads/pdfs/{filename}"
            };


            _context.Pdfs.Add(pdfRecord);
            await _context.SaveChangesAsync();

            return Ok(new { message = "PDF generated successfully", path = pdfRecord.PdfPath });
        }
    }

    public class PdfRequestModel
    {
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Type { get; set; }  // Question / Answer
        public string Language { get; set; } // Tamil / English
        public DateTime FromDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
