using Microsoft.EntityFrameworkCore;
using EmployerService.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// EF Core — SQL Server (database-per-service)
builder.Services.AddDbContext<EmployerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EmployerDb")));

var app = builder.Build();

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EmployerDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
