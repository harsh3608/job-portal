using Microsoft.EntityFrameworkCore;
using ApplicationService.Data;
using ApplicationService.Events;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// EF Core — SQL Server (database-per-service)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ApplicationDb")));

// RabbitMQ event publisher (singleton — manages its own connection)
builder.Services.AddSingleton<RabbitMqPublisher>();

var app = builder.Build();

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
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
