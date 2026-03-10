namespace ResumeSearchService.Models;

/// <summary>
/// Document stored in the Elasticsearch "resumes" index.
/// </summary>
public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CandidateName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public int ExperienceYears { get; set; }
    public string Summary { get; set; } = string.Empty;
}
