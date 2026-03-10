namespace JobService.Models;

public enum JobType { FullTime, PartTime, Contract, Remote }
public enum JobStatus { Open, Closed, Paused }

public class Job
{
    public int Id { get; set; }
    public int EmployerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredSkills { get; set; } = new();
    public int MinExperienceYears { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobType Type { get; set; } = JobType.FullTime;
    public JobStatus Status { get; set; } = JobStatus.Open;
    public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
}

public class CreateJobRequest
{
    public int EmployerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredSkills { get; set; } = new();
    public int MinExperienceYears { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobType Type { get; set; } = JobType.FullTime;
    public DateTime? ExpiresAt { get; set; }
}
