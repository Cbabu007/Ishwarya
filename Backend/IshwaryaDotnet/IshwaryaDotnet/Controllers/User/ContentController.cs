using IshwaryaDotnet.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;

namespace IshwaryaDotnet.Controllers.User
{
    [Route("api/user/content")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ContentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("by-login")]
        public IActionResult GetContentByLogin([FromForm] string username, [FromForm] string password)
        {
            var contents = new List<Content>();
            string course = null;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand("UserLogin", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    // 1️⃣ Read StudentRegistration result to get the student's Course
                    if (reader.HasRows && reader.Read())
                    {
                        course = reader["Course"]?.ToString();
                    }

                    // 2️⃣ Skip Pdf and Exam result sets
                    reader.NextResult(); // Pdf
                    reader.NextResult(); // Exam

                    // 3️⃣ Notes result set
                    if (reader.NextResult() && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            if (reader["Course"]?.ToString() == course)
                            {
                                contents.Add(new Content
                                {
                                    Course = reader["Course"]?.ToString(),
                                    Subject = reader["Subject"]?.ToString(),
                                    Topic = reader["Topic"]?.ToString(),
                                    PdfPath = reader["PdfPath"]?.ToString(),
                                    VideoPath = reader["VideoPath"]?.ToString()
                                });
                            }
                        }
                    }
                }
            }

            return Ok(contents);
        }
    }
}
