using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Models.Admin.QuestionAnswer
{
    [Table("QuestionAnswer")]
    public class QuestionAnswer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Type { get; set; }
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }

        public string? QuestionPaperPath { get; set; }
        public string? AnswerPaperPath { get; set; }

        public DateTime UploadedDate { get; set; }
    }
}
