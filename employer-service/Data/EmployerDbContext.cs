using Microsoft.EntityFrameworkCore;
using EmployerService.Models;

namespace EmployerService.Data;

public class EmployerDbContext : DbContext
{
    public EmployerDbContext(DbContextOptions<EmployerDbContext> options) : base(options) { }

    public DbSet<Employer> Employers => Set<Employer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ContactEmail).IsUnique();
            entity.Property(e => e.CompanyName).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Industry).HasMaxLength(100);
            entity.Property(e => e.Website).HasMaxLength(500);
            entity.Property(e => e.ContactEmail).HasMaxLength(256).IsRequired();
            entity.Property(e => e.ContactPhone).HasMaxLength(20);
            entity.Property(e => e.Description).HasMaxLength(4000);
        });
    }
}
