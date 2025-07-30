using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Models.Admin.Notes
{
    [Table("Notes")]
    public class NotesModel
    {
        [Key]
        public Guid Id { get; set; }

        public string Mode { get; set; }
        public string Course { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }

        public string? VideoPath { get; set; }
        public string? PdfPath { get; set; }

        [NotMapped]
        public IFormFile? VideoFile { get; set; }

        [NotMapped]
        public IFormFile? PdfFile { get; set; }
    }
}
