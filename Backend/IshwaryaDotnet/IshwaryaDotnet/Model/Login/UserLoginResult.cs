using System;
using System.Collections.Generic;
using IshwaryaDotnet.Models.Admin.Registration;
using IshwaryaDotnet.Models.Admin.Class;
using IshwaryaDotnet.Models.Admin.Notes;
using IshwaryaDotnet.Models.Admin.Test;

namespace IshwaryaDotnet.Models.Login
{
    public class UserLoginResult
    {
        public Registration StudentProfile { get; set; }
        public List<Pdf> Pdfs { get; set; }
        public List<Exam> Exams { get; set; }
        public List<NotesModel> Notes { get; set; }
        public List<Test> Tests { get; set; }
        public string RedirectUrl { get; set; }
    }
}
