using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Model.User
{
    [Table("Answer")]
    public class Answer
    {
        [Key]
        public int Id { get; set; } // Add a primary key

        public string Username { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public int TestNo { get; set; }
        public string Language { get; set; }
        public DateTime Date { get; set; }
        public int QuestionNo { get; set; }
        public string AnswerText { get; set; }  // Renamed to avoid clash with class name
    }
}
