using Microsoft.AspNetCore.Http;

namespace IshwaryaDotnet.Models.Admin.QuestionAnswer
{
    public class QuestionAnswerUploadDto
    {
        public string? Type { get; set; }
        public string Course { get; set; }
        public string TestName { get; set; }
        public string Subject { get; set; }
        public string Topic { get; set; }
        public string TestNo { get; set; }

        public IFormFile? QuestionFile { get; set; }
        public IFormFile? AnswerFile { get; set; }
    }
}
