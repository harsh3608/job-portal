using Microsoft.EntityFrameworkCore;
using ApplicationService.Models;

namespace ApplicationService.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<JobApplication> Applications => Set<JobApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.JobId, e.CandidateId }).IsUnique();
            entity.Property(e => e.CoverLetter).HasMaxLength(4000);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
        });
    }
}
