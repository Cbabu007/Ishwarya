using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IshwaryaDotnet.Data;
using System.Linq;
using System;
using IshwaryaDotnet.Model.User;

namespace IshwaryaDotnet.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IshDbContext _context;

        public DashboardController(IshDbContext context)
        {
            _context = context;
        }

        // 🔹 Graph data for logged-in user only
        [HttpGet("graph-data")]
        public IActionResult GetGraphData()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("Login required");

            var registration = _context.Registrations.FirstOrDefault(r => r.UserName == username);
            var name = registration == null
                ? username
                : string.Join(" ", new[] { registration.FirstName, registration.MiddleName, registration.LastName }
                    .Where(s => !string.IsNullOrWhiteSpace(s))).Trim();
            var photo = registration?.PhotoPath ?? "";

            var data = _context.ResultSummaries
                .Where(r => r.Username == username)
                .OrderBy(r => r.CreatedAt)
                .Select(r => new
                {
                    date = r.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                    score = r.TotalScore,
                    username = r.Username,
                    name = name,
                    photo = photo
                })
                .ToList();

            return Ok(data);
        }

        [HttpGet("leaderboard")]
        public IActionResult GetLeaderboard()
        {
            var result = _context.ResultSummaries
                .GroupBy(r => r.Username)
                .Select(g => new
                {
                    Username = g.Key,
                    TotalScore = g.Sum(x => x.TotalScore)
                })
                .OrderByDescending(x => x.TotalScore)
                .ToList();

            // Join with Registration to get Name and Photo
            var leaderboard = result
                .Select(x =>
                {
                    var reg = _context.Registrations.FirstOrDefault(r => r.UserName == x.Username);
                    var name = reg == null
                        ? x.Username
                        : string.Join(" ", new[] { reg.FirstName, reg.MiddleName, reg.LastName }
                            .Where(s => !string.IsNullOrWhiteSpace(s))).Trim();
                    var photo = reg?.PhotoPath ?? "";
                    return new
                    {
                        x.Username,
                        Name = name,
                        Photo = photo,
                        x.TotalScore
                    };
                })
                .ToList();

            return Ok(leaderboard);
        }

        // GET: Daily Leaderboard (Ranked by Correct answers)
        [HttpGet("leaderboard-today")]
        public IActionResult GetTodayLeaderboard()
        {
            var today = DateTime.Today;
            var leaderboard = _context.ResultSummaries
                .Where(r => r.Date.Date == today)
                .GroupBy(r => r.Username)
                .Select(g => new
                {
                    Username = g.Key,
                    TotalCorrect = g.Sum(x => x.Correct)
                })
                .OrderByDescending(x => x.TotalCorrect)
                .ToList();

            // Add rank and join with Registration for Name and Photo
            var ranked = leaderboard
                .Select((x, i) =>
                {
                    var reg = _context.Registrations.FirstOrDefault(r => r.UserName == x.Username);
                    var name = reg == null
                        ? x.Username
                        : string.Join(" ", new[] { reg.FirstName, reg.MiddleName, reg.LastName }
                            .Where(s => !string.IsNullOrWhiteSpace(s))).Trim();
                    var photo = reg?.PhotoPath ?? "";
                    return new
                    {
                        Rank = i + 1,
                        x.Username,
                        Name = name,
                        Photo = photo,
                        x.TotalCorrect
                    };
                })
                .ToList();

            return Ok(ranked);
        }

        // GET: Graph Data - Total Correct Answers per User
        [HttpGet("correct-graph")]
        public IActionResult GetCorrectGraph()
        {
            var graphData = _context.ResultSummaries
                .GroupBy(r => r.Username)
                .Select(g => new
                {
                    Username = g.Key,
                    TotalCorrect = g.Sum(x => x.Correct)
                })
                .OrderByDescending(x => x.TotalCorrect)
                .ToList();

            // Join with Registration for Name and Photo
            var graphWithName = graphData
                .Select(x =>
                {
                    var reg = _context.Registrations.FirstOrDefault(r => r.UserName == x.Username);
                    var name = reg == null
                        ? x.Username
                        : string.Join(" ", new[] { reg.FirstName, reg.MiddleName, reg.LastName }
                            .Where(s => !string.IsNullOrWhiteSpace(s))).Trim();
                    var photo = reg?.PhotoPath ?? "";
                    return new
                    {
                        x.Username,
                        Name = name,
                        Photo = photo,
                        x.TotalCorrect
                    };
                })
                .ToList();

            return Ok(graphWithName);
        }
    }
}
