using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using ResumeSearchService.Models;

namespace ResumeSearchService.Services;

/// <summary>
/// Encapsulates all Elasticsearch operations for the "resumes" index.
/// </summary>
public class ElasticResumeService
{
    private readonly ElasticsearchClient _client;
    private const string IndexName = "resumes";

    public ElasticResumeService(ElasticsearchClient client)
    {
        _client = client;
    }

    // ──────────────── Seed ────────────────

    /// <summary>
    /// Ensures the index exists and seeds sample data when the index is empty.
    /// </summary>
    public async Task SeedAsync()
    {
        var existsResponse = await _client.Indices.ExistsAsync(IndexName);
        if (!existsResponse.Exists)
        {
            await _client.Indices.CreateAsync(IndexName);
        }

        var countResponse = await _client.CountAsync(IndexName);
        if (countResponse.Count > 0) return;

        var sampleResumes = new List<Resume>
        {
            new() { Id = Guid.NewGuid(), CandidateName = "Alice Johnson",  Title = "Senior .NET Developer",   Skills = ["C#", ".NET", "Azure", "SQL Server", "Docker"],                  ExperienceYears = 8, Summary = "Full-stack .NET developer with cloud experience." },
            new() { Id = Guid.NewGuid(), CandidateName = "Bob Smith",      Title = "DevOps Engineer",          Skills = ["Docker", "Kubernetes", "Terraform", "CI/CD", "Azure DevOps"],  ExperienceYears = 5, Summary = "DevOps engineer specialising in container orchestration." },
            new() { Id = Guid.NewGuid(), CandidateName = "Carol Lee",      Title = "React / Node Full-Stack",  Skills = ["React", "Node.js", "TypeScript", "MongoDB", "GraphQL"],       ExperienceYears = 4, Summary = "JavaScript full-stack developer." },
            new() { Id = Guid.NewGuid(), CandidateName = "Dave Patel",     Title = "Data Engineer",            Skills = ["Python", "Spark", "Kafka", "SQL", "Azure Data Factory"],      ExperienceYears = 6, Summary = "Data engineer building ETL pipelines at scale." },
            new() { Id = Guid.NewGuid(), CandidateName = "Eva Martinez",   Title = "Junior Backend Developer", Skills = ["C#", ".NET", "SQL Server"],                                    ExperienceYears = 1, Summary = "Recent graduate eager to learn microservices." }
        };

        foreach (var resume in sampleResumes)
        {
            await _client.IndexAsync(resume, idx => idx.Index(IndexName).Id(resume.Id.ToString()));
        }

        // Refresh so the documents are immediately searchable
        await _client.Indices.RefreshAsync(IndexName);
    }

    // ──────────────── Search ────────────────

    /// <summary>
    /// Multi-match search across CandidateName, Title, Skills, and Summary.
    /// </summary>
    public async Task<List<Resume>> SearchAsync(string query)
    {
        var response = await _client.SearchAsync<Resume>(s => s
            .Indices(IndexName)
            .Size(20)
            .Query(q => q
                .MultiMatch(mm => mm
                    .Query(query)
                    .Fields(new[] { "candidateName", "title", "skills", "summary" })
                    .Fuzziness(new Fuzziness("AUTO"))
                )
            )
        );

        return response.Documents.ToList();
    }

    // ──────────────── Get by Id ────────────────

    public async Task<Resume?> GetByIdAsync(Guid id)
    {
        var response = await _client.GetAsync<Resume>(id.ToString(), g => g.Index(IndexName));
        return response.Found ? response.Source : null;
    }

    // ──────────────── Index (add / update) ────────────────

    public async Task IndexAsync(Resume resume)
    {
        await _client.IndexAsync(resume, idx => idx.Index(IndexName).Id(resume.Id.ToString()));
        await _client.Indices.RefreshAsync(IndexName);
    }

    // ──────────────── Delete ────────────────

    public async Task<bool> DeleteAsync(Guid id)
    {
        var response = await _client.DeleteAsync(IndexName, id.ToString());
        return response.Result == Result.Deleted;
    }
}
