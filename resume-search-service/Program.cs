using Elastic.Clients.Elasticsearch;
using Elastic.Transport;
using ResumeSearchService.Services;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Elasticsearch: Aspire injects ConnectionStrings:elasticsearch; fall back to custom key for docker-compose
var esUrl = builder.Configuration.GetConnectionString("elasticsearch")
    ?? builder.Configuration["Elasticsearch:Url"]
    ?? "http://elasticsearch:9200";
var settings = new ElasticsearchClientSettings(new Uri(esUrl))
    .DefaultIndex("resumes")
    .ServerCertificateValidationCallback(CertificateValidations.AllowAll);

builder.Services.AddSingleton(new ElasticsearchClient(settings));
builder.Services.AddScoped<ElasticResumeService>();

var app = builder.Build();

// Seed Elasticsearch index on startup
using (var scope = app.Services.CreateScope())
{
    var resumeService = scope.ServiceProvider.GetRequiredService<ElasticResumeService>();
    await resumeService.SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseSerilogRequestLogging();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.MapDefaultEndpoints();
app.Run();
