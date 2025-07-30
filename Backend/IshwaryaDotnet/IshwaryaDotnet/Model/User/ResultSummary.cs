using System.ComponentModel.DataAnnotations.Schema;

namespace IshwaryaDotnet.Model.User
{
    [Table("ResultSummary")]  // ✅ Matches actual SQL table
    public class ResultSummary
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }
        public string Language { get; set; }
        public DateTime Date { get; set; }
        public int Correct { get; set; }
        public int Wrong { get; set; }
        public int Skipped { get; set; }
        public decimal TotalScore { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
