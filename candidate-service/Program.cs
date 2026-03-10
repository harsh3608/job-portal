using Microsoft.EntityFrameworkCore;
using CandidateService.Data;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// EF Core — SQL Server (database-per-service)
builder.Services.AddDbContext<CandidateDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CandidateDb")));

var app = builder.Build();

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CandidateDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseSerilogRequestLogging();
app.UseAuthorization();
app.MapControllers();
app.Run();
