using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CandidateService.Data;
using CandidateService.Models;

namespace CandidateService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly CandidateDbContext _db;

    public CandidatesController(CandidateDbContext db) => _db = db;

    /// <summary>GET /api/candidates — List all candidates</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Candidates.AsNoTracking().ToListAsync());

    /// <summary>GET /api/candidates/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var candidate = await _db.Candidates.FindAsync(id);
        return candidate is null ? NotFound() : Ok(candidate);
    }

    /// <summary>POST /api/candidates — Create a candidate profile</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCandidateRequest request)
    {
        var candidate = new Candidate
        {
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Summary = request.Summary,
            Skills = request.Skills,
            ExperienceYears = request.ExperienceYears
        };

        _db.Candidates.Add(candidate);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = candidate.Id }, candidate);
    }

    /// <summary>PUT /api/candidates/{id} — Update candidate profile</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCandidateRequest request)
    {
        var candidate = await _db.Candidates.FindAsync(id);
        if (candidate is null) return NotFound();

        candidate.FullName = request.FullName;
        candidate.Email = request.Email;
        candidate.Phone = request.Phone;
        candidate.Summary = request.Summary;
        candidate.Skills = request.Skills;
        candidate.ExperienceYears = request.ExperienceYears;

        await _db.SaveChangesAsync();
        return Ok(candidate);
    }

    /// <summary>DELETE /api/candidates/{id}</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var candidate = await _db.Candidates.FindAsync(id);
        if (candidate is null) return NotFound();

        _db.Candidates.Remove(candidate);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
