using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployerService.Data;
using EmployerService.Models;

namespace EmployerService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployersController : ControllerBase
{
    private readonly EmployerDbContext _db;

    public EmployersController(EmployerDbContext db) => _db = db;

    /// <summary>GET /api/employers</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Employers.AsNoTracking().ToListAsync());

    /// <summary>GET /api/employers/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employer = await _db.Employers.FindAsync(id);
        return employer is null ? NotFound() : Ok(employer);
    }

    /// <summary>POST /api/employers — Register a company</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployerRequest request)
    {
        var employer = new Employer
        {
            CompanyName = request.CompanyName,
            Industry = request.Industry,
            Website = request.Website,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Description = request.Description
        };

        _db.Employers.Add(employer);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = employer.Id }, employer);
    }

    /// <summary>PUT /api/employers/{id}</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateEmployerRequest request)
    {
        var employer = await _db.Employers.FindAsync(id);
        if (employer is null) return NotFound();

        employer.CompanyName = request.CompanyName;
        employer.Industry = request.Industry;
        employer.Website = request.Website;
        employer.ContactEmail = request.ContactEmail;
        employer.ContactPhone = request.ContactPhone;
        employer.Description = request.Description;

        await _db.SaveChangesAsync();
        return Ok(employer);
    }

    /// <summary>DELETE /api/employers/{id}</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var employer = await _db.Employers.FindAsync(id);
        if (employer is null) return NotFound();

        _db.Employers.Remove(employer);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
