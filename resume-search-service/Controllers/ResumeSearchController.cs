using Microsoft.AspNetCore.Mvc;
using ResumeSearchService.Models;
using ResumeSearchService.Services;

namespace ResumeSearchService.Controllers;

/// <summary>
/// Resume Search Service — powered by Elasticsearch.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ResumeSearchController : ControllerBase
{
    private readonly ElasticResumeService _elastic;

    public ResumeSearchController(ElasticResumeService elastic) => _elastic = elastic;

    /// <summary>GET /api/resumesearch?q=keyword — Full-text search across resumes</summary>
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q = "")
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(new { message = "Query parameter 'q' is required." });

        var results = await _elastic.SearchAsync(q);
        return Ok(results);
    }

    /// <summary>GET /api/resumesearch/{id} — Get a single resume by Id</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var resume = await _elastic.GetByIdAsync(id);
        return resume is null ? NotFound() : Ok(resume);
    }

    /// <summary>POST /api/resumesearch — Index (add) a resume</summary>
    [HttpPost]
    public async Task<IActionResult> Index([FromBody] Resume resume)
    {
        if (resume.Id == Guid.Empty) resume.Id = Guid.NewGuid();
        await _elastic.IndexAsync(resume);
        return CreatedAtAction(nameof(GetById), new { id = resume.Id }, resume);
    }

    /// <summary>DELETE /api/resumesearch/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _elastic.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
