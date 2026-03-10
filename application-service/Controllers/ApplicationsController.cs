using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApplicationService.Data;
using ApplicationService.Events;
using ApplicationService.Models;

namespace ApplicationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly RabbitMqPublisher _mq;

    public ApplicationsController(ApplicationDbContext db, RabbitMqPublisher mq)
    {
        _db = db;
        _mq = mq;
    }

    /// <summary>GET /api/applications — All applications</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Applications.AsNoTracking().ToListAsync());

    /// <summary>GET /api/applications/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var app = await _db.Applications.FindAsync(id);
        return app is null ? NotFound() : Ok(app);
    }

    /// <summary>GET /api/applications/candidate/{candidateId} — All applications by a candidate</summary>
    [HttpGet("candidate/{candidateId:int}")]
    public async Task<IActionResult> GetByCandidate(int candidateId)
        => Ok(await _db.Applications.AsNoTracking()
            .Where(a => a.CandidateId == candidateId).ToListAsync());

    /// <summary>GET /api/applications/job/{jobId} — All applications for a job</summary>
    [HttpGet("job/{jobId:int}")]
    public async Task<IActionResult> GetByJob(int jobId)
        => Ok(await _db.Applications.AsNoTracking()
            .Where(a => a.JobId == jobId).ToListAsync());

    /// <summary>POST /api/applications — Apply to a job</summary>
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] CreateApplicationRequest request)
    {
        bool alreadyApplied = await _db.Applications
            .AnyAsync(a => a.JobId == request.JobId && a.CandidateId == request.CandidateId);

        if (alreadyApplied)
            return Conflict(new { message = "You have already applied for this job." });

        var application = new JobApplication
        {
            JobId = request.JobId,
            CandidateId = request.CandidateId,
            CoverLetter = request.CoverLetter
        };

        _db.Applications.Add(application);
        await _db.SaveChangesAsync();

        // 🐇 Publish "JobApplied" event to RabbitMQ
        await _mq.PublishAsync("job.applied", new
        {
            ApplicationId = application.Id,
            application.JobId,
            application.CandidateId,
            application.AppliedAt
        });

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    /// <summary>PATCH /api/applications/{id}/status — Update application status (by employer)</summary>
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusRequest request)
    {
        var app = await _db.Applications.FindAsync(id);
        if (app is null) return NotFound();

        app.Status = request.Status;
        app.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(app);
    }
}
