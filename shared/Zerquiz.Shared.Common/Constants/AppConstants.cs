namespace Zerquiz.Shared.Common.Constants;

/// <summary>
/// Application-wide constants
/// </summary>
public static class AppConstants
{
    public const string DefaultCulture = "tr-TR";
    public const string DateFormat = "yyyy-MM-dd";
    public const string DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
    
    public static class Roles
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string TenantAdmin = "TenantAdmin";
        public const string Teacher = "Teacher";
        public const string Student = "Student";
        public const string Author = "Author";
        public const string Reviewer = "Reviewer";
    }
    
    public static class Permissions
    {
        public const string ManageTenant = "tenant:manage";
        public const string ManageUsers = "users:manage";
        public const string CreateQuestions = "questions:create";
        public const string ReviewQuestions = "questions:review";
        public const string PublishQuestions = "questions:publish";
        public const string CreateExams = "exams:create";
        public const string ManageExams = "exams:manage";
        public const string ViewReports = "reports:view";
        public const string ManageRoyalties = "royalties:manage";
    }
    
    public static class QuestionStatus
    {
        public const string Draft = "draft";
        public const string InternalReview = "internal_review";
        public const string ReviewRequested = "review_requested";
        public const string Approved = "approved";
        public const string Published = "published";
        public const string Archived = "archived";
    }
    
    public static class ExamModes
    {
        public const string Printed = "printed";
        public const string Online = "online";
        public const string Offline = "offline";
    }
    
    public static class ExamStatus
    {
        public const string Draft = "draft";
        public const string Scheduled = "scheduled";
        public const string Active = "active";
        public const string Completed = "completed";
    }
}

