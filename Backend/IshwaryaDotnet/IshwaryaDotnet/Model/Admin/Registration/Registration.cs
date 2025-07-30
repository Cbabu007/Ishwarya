using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace IshwaryaDotnet.Models.Admin.Registration
{
    [Table("StudentRegistration")]
    public class Registration
    {
        [Key]
        public string Id { get; set; }

        public string Role { get; set; }
        public string Course { get; set; }

        [NotMapped]
        public IFormFile Photo { get; set; }

        public string? PhotoPath { get; set; }

        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }

        public DateTime DateOfBirth { get; set; }
        public string BloodGroup { get; set; }
        public string PhoneNumber { get; set; }
        public string AlternativePhoneNumber { get; set; }
        public string Email { get; set; }

        public DateTime AdmissionDate { get; set; }
        public string FatherName { get; set; }
        public string FatherOccupation { get; set; }
        public string FatherPhoneNumber { get; set; }
        public string MotherName { get; set; }
        public string MotherOccupation { get; set; }
        public string MotherPhoneNumber { get; set; }
        public string ParentEmail { get; set; }

        public string AadharNumber { get; set; }

        [NotMapped]
        public IFormFile UploadAadhar { get; set; }
        public string? AadharPath { get; set; }

        public string Religion { get; set; }
        public string Caste { get; set; }
        public string CasteName { get; set; }
        public string Nationality { get; set; }

        public string AddressType { get; set; }
        public string DoorNo { get; set; }
        public string Street { get; set; }
        public string Area { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string State { get; set; }
        public string Pincode { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }
        // Qualification 1–10
        public string? DegreeType1 { get; set; }
        public string? DegreeName1 { get; set; }
        public string? InstituteName1 { get; set; }
        public string? YearPassedOut1 { get; set; }

        public string? DegreeType2 { get; set; }
        public string? DegreeName2 { get; set; }
        public string? InstituteName2 { get; set; }
        public string? YearPassedOut2 { get; set; }

        public string? DegreeType3 { get; set; }
        public string? DegreeName3 { get; set; }
        public string? InstituteName3 { get; set; }
        public string? YearPassedOut3 { get; set; }

        public string? DegreeType4 { get; set; }
        public string? DegreeName4 { get; set; }
        public string? InstituteName4 { get; set; }
        public string? YearPassedOut4 { get; set; }

        public string? DegreeType5 { get; set; }
        public string? DegreeName5 { get; set; }
        public string? InstituteName5 { get; set; }
        public string? YearPassedOut5 { get; set; }

        public string? DegreeType6 { get; set; }
        public string? DegreeName6 { get; set; }
        public string? InstituteName6 { get; set; }
        public string? YearPassedOut6 { get; set; }

        public string? DegreeType7 { get; set; }
        public string? DegreeName7 { get; set; }
        public string? InstituteName7 { get; set; }
        public string? YearPassedOut7 { get; set; }

        public string? DegreeType8 { get; set; }
        public string? DegreeName8 { get; set; }
        public string? InstituteName8 { get; set; }
        public string? YearPassedOut8 { get; set; }

        public string? DegreeType9 { get; set; }
        public string? DegreeName9 { get; set; }
        public string? InstituteName9 { get; set; }
        public string? YearPassedOut9 { get; set; }

        public string? DegreeType10 { get; set; }
        public string? DegreeName10 { get; set; }
        public string? InstituteName10 { get; set; }
        public string? YearPassedOut10 { get; set; }

    }
}
