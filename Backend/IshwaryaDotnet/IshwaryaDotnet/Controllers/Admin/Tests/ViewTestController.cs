using Microsoft.AspNetCore.Mvc;

namespace IshwaryaDotnet.Controllers.Admin.Tests
{
    public class ViewTestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
