using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Models.Admin.Test
{
    [Table("Test")]
    public class Test
    {
        [Key]
        public Guid Id { get; set; }


        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }
        public string Language { get; set; }
        public DateTime Date { get; set; }
        public string QuestionNo { get; set; }
        public string Question { get; set; }
        public string Type { get; set; } // Vertical or Horizontal
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string Answer { get; set; }
        public string? Timing { get; set; }

    }
}
