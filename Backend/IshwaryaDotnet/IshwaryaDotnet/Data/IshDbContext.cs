using IshwaryaDotnet.Model.User;
using IshwaryaDotnet.Models.Admin.Class;
using IshwaryaDotnet.Models.Admin.Notes;
using IshwaryaDotnet.Models.Admin.QuestionAnswer;
using IshwaryaDotnet.Models.Admin.Registration;
using IshwaryaDotnet.Models.Admin.Test;
using IshwaryaDotnet.Models.User;
using Microsoft.EntityFrameworkCore;

namespace IshwaryaDotnet.Data
{
    public class IshDbContext : DbContext
    {
        public IshDbContext(DbContextOptions<IshDbContext> options) : base(options) { }

        public DbSet<Registration> Registrations { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<NotesModel> Notes { get; set; }
        public DbSet<Exam> Exams { get; set; }  // Add this line under DbSets
        public DbSet<Pdf> Pdfs { get; set; }
        public DbSet<Test> Test { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<ResultSummary> ResultSummaries { get; set; }
        public DbSet<QuestionAnswer> QuestionAnswers { get; set; }

        public async Task<int> InsertTestAsync(Test test)
        {
            var sql = @"
                EXEC InsertTest 
                    @Course = {0},
                    @TestName = {1},
                    @Subject = {2},
                    @Topic = {3},
                    @TestNo = {4},
                    @Language = {5},
                    @Date = {6},
                    @QuestionNo = {7},
                    @Question = {8},
                    @Type = {9},
                    @OptionA = {10},
                    @OptionB = {11},
                    @OptionC = {12},
                    @OptionD = {13},
                    @Answer = {14}";

            return await Database.ExecuteSqlRawAsync(
                sql,
                test.Course,
                test.TestName,
                test.Subject,
                test.Topic,
                test.TestNo,
                test.Language,
                test.Date,
                test.QuestionNo,
                test.Question,
                test.Type,
                test.OptionA,
                test.OptionB,
                test.OptionC,
                test.OptionD,
                test.Answer
            );
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map Registration to StudentRegistration table
            modelBuilder.Entity<Registration>().ToTable("StudentRegistration");
           
            modelBuilder.Entity<NotesModel>().ToTable("Notes");
            modelBuilder.Entity<ResultSummary>().ToTable("ResultSummary");

            base.OnModelCreating(modelBuilder);

        }
    }
}
