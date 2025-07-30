using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace IshwaryaDotnet.Models.Admin.Notes
{
    [Table("Exam")]
    public class Exam
    {
        [Key]
        public int ID { get; set; }

        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }

        public string? Video { get; set; }
        public string? Pdf { get; set; }

        [NotMapped]
        public IFormFile? VideoFile { get; set; }

        [NotMapped]
        public IFormFile? PdfFile { get; set; }
    }
}
