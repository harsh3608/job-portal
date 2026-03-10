namespace ResumeSearchService.Models;

public class ResumeSearchRequest
{
    public List<string> Skills { get; set; } = new();
    public int? MinExperienceYears { get; set; }
    public string? Location { get; set; }
    public string? Keyword { get; set; }
}

public class ResumeResult
{
    public int CandidateId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public int ExperienceYears { get; set; }
    public string Summary { get; set; } = string.Empty;
    public double MatchScore { get; set; }
}
