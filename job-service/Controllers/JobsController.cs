using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using JobService.Data;
using JobService.Models;

namespace JobService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly JobDbContext _db;
    private readonly IDistributedCache _cache;
    private const string AllJobsCacheKey = "all_open_jobs";
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
        SlidingExpiration = TimeSpan.FromMinutes(2)
    };

    public JobsController(JobDbContext db, IDistributedCache cache)
    {
        _db = db;
        _cache = cache;
    }

    /// <summary>GET /api/jobs — List all open jobs (with optional filters). Uses Redis cache.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? title, [FromQuery] string? location, [FromQuery] string? skill)
    {
        // When no filters are applied, try the Redis cache first
        bool hasFilters = !string.IsNullOrWhiteSpace(title)
                       || !string.IsNullOrWhiteSpace(location)
                       || !string.IsNullOrWhiteSpace(skill);

        if (!hasFilters)
        {
            var cached = await _cache.GetStringAsync(AllJobsCacheKey);
            if (cached is not null)
                return Ok(JsonSerializer.Deserialize<List<Job>>(cached));
        }

        var query = _db.Jobs.AsNoTracking().Where(j => j.Status == JobStatus.Open);

        if (!string.IsNullOrWhiteSpace(title))
            query = query.Where(j => j.Title.Contains(title));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.Contains(location));

        // Skill filtering must happen client-side because RequiredSkills is a JSON column
        var jobs = await query.ToListAsync();

        if (!string.IsNullOrWhiteSpace(skill))
            jobs = jobs.Where(j => j.RequiredSkills
                .Any(s => s.Contains(skill, StringComparison.OrdinalIgnoreCase)))
                .ToList();

        // Cache unfiltered result
        if (!hasFilters)
        {
            var json = JsonSerializer.Serialize(jobs);
            await _cache.SetStringAsync(AllJobsCacheKey, json, CacheOptions);
        }

        return Ok(jobs);
    }

    /// <summary>GET /api/jobs/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        return job is null ? NotFound() : Ok(job);
    }

    /// <summary>GET /api/jobs/employer/{employerId} — Jobs posted by employer</summary>
    [HttpGet("employer/{employerId:int}")]
    public async Task<IActionResult> GetByEmployer(int employerId)
        => Ok(await _db.Jobs.AsNoTracking()
            .Where(j => j.EmployerId == employerId).ToListAsync());

    /// <summary>POST /api/jobs — Post a new job</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobRequest request)
    {
        var job = new Job
        {
            EmployerId = request.EmployerId,
            Title = request.Title,
            Company = request.Company,
            Location = request.Location,
            Description = request.Description,
            RequiredSkills = request.RequiredSkills,
            MinExperienceYears = request.MinExperienceYears,
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            Type = request.Type,
            ExpiresAt = request.ExpiresAt
        };

        _db.Jobs.Add(job);
        await _db.SaveChangesAsync();

        // Bust the cache so the new job shows up
        await _cache.RemoveAsync(AllJobsCacheKey);

        return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
    }

    /// <summary>PUT /api/jobs/{id}/close — Close a job posting</summary>
    [HttpPut("{id:int}/close")]
    public async Task<IActionResult> Close(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job is null) return NotFound();

        job.Status = JobStatus.Closed;
        await _db.SaveChangesAsync();
        await _cache.RemoveAsync(AllJobsCacheKey);
        return Ok(job);
    }

    /// <summary>DELETE /api/jobs/{id}</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job is null) return NotFound();

        _db.Jobs.Remove(job);
        await _db.SaveChangesAsync();
        await _cache.RemoveAsync(AllJobsCacheKey);
        return NoContent();
    }
}
