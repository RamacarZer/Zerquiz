using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Grading.Domain.Entities;

/// <summary>
/// Sıralama - Sınıf, okul, şehir, ülke, branş bazında
/// </summary>
public class Ranking : BaseEntity
{
    public Guid ExamId { get; set; }
    public Guid UserId { get; set; }
    public Guid ExamResultId { get; set; }
    
    // Ranking Scope
    public string Scope { get; set; } = string.Empty; // class, school, city, country, subject, global
    public Guid? ScopeId { get; set; } // ClassId, SchoolId, CityId, etc.
    public string? ScopeName { get; set; } // Scope display name
    
    // Ranking Data
    public int Rank { get; set; } // Sıralama (1, 2, 3...)
    public decimal Score { get; set; } // Puan
    public decimal SuccessRate { get; set; } // Başarı oranı (%)
    public int TotalParticipants { get; set; } // Toplam katılımcı
    public decimal Percentile { get; set; } // Yüzdelik dilim
    
    // Subject-specific (optional)
    public Guid? SubjectId { get; set; } // Branş bazlı sıralama için
    public string? SubjectName { get; set; }
    
    // Time & Calculation
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExamDate { get; set; }
    
    // Additional Stats
    public decimal? AverageScore { get; set; } // Ortalama puan
    public decimal? MedianScore { get; set; } // Medyan
    public decimal? StandardDeviation { get; set; } // Standart sapma
    
    // Navigation
    public ExamResult ExamResult { get; set; } = null!;
}

