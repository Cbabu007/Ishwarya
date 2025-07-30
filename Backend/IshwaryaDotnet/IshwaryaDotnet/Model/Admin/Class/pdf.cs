using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Models.Admin.Class
{
    [Table("Pdf")]
    public class Pdf
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public string Type { get; set; } // "Question" or "Answer"

        [Required]
        public string Course { get; set; }

        [Required]
        public string TestName { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Topic { get; set; }

        [Required]
        public string TestNo { get; set; }

        [Required]
        public string Language { get; set; } // "Tamil", "English", or "Both"

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string PdfPath { get; set; } // e.g., "/uploads/pdfs/xyz.pdf"
    }
}
