namespace ApplicationService.Models;

public enum ApplicationStatus { Pending, Reviewed, Shortlisted, Rejected, Hired }

public class JobApplication
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class CreateApplicationRequest
{
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
}

public class UpdateApplicationStatusRequest
{
    public ApplicationStatus Status { get; set; }
}
