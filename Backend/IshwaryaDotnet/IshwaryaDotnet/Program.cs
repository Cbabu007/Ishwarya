using IshwaryaDotnet.Data;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// ? Add Controllers with Newtonsoft JSON
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    });

// ? Configure EF Core with SQL Server
builder.Services.AddDbContext<IshDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ? Allow larger file uploads (100 MB)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100 MB
});

// ? Enable CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")

               .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddAuthentication("MyCookieAuth")
    .AddCookie("MyCookieAuth", options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

builder.Services.AddAuthorization();

// ? Swagger Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ? Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ? Serve files from wwwroot
app.UseStaticFiles();

// ? Custom uploads directory mappings
var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
var photosPath = Path.Combine(uploadsRoot, "photos");
var aadharsPath = Path.Combine(uploadsRoot, "aadhars");
var notesPdfPath = Path.Combine(uploadsRoot, "Notes", "PDF");
var notesVideoPath = Path.Combine(uploadsRoot, "Notes", "VIDEO");

// ? Create directories if not exist
Directory.CreateDirectory(photosPath);
Directory.CreateDirectory(aadharsPath);
Directory.CreateDirectory(notesPdfPath);
Directory.CreateDirectory(notesVideoPath);

// Serve wwwroot/uploads/QuestionPapers
var questionPapersPath = Path.Combine(builder.Environment.WebRootPath, "uploads", "QuestionPapers");
Directory.CreateDirectory(questionPapersPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(questionPapersPath),
    RequestPath = "/uploads/QuestionPapers"
});

// Serve wwwroot/uploads/AnswerPapers
var answerPapersPath = Path.Combine(builder.Environment.WebRootPath, "uploads", "AnswerPapers");
Directory.CreateDirectory(answerPapersPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(answerPapersPath),
    RequestPath = "/uploads/AnswerPapers"
});

// ? Static file mappings
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath = "/uploads"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(notesPdfPath),
    RequestPath = "/uploads/Notes/PDF"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(notesVideoPath),
    RequestPath = "/uploads/Notes/VIDEO"
});

// ? Optional: Log all requests (for debugging)
app.Use(async (context, next) =>
{
    Console.WriteLine($"[REQ] {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
});

// ? Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.UseAuthentication();

// ? API Endpoints
app.MapControllers();

// ? Debug info
Console.WriteLine("[DEBUG] uploadsRoot: " + uploadsRoot);
Console.WriteLine("[DEBUG] notesPdfPath: " + notesPdfPath);
Console.WriteLine("[DEBUG] notesVideoPath: " + notesVideoPath);

// ? Start application
app.Run();
