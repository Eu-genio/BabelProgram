using Babel.Api.Modules.Portfolios.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Babel.Api.Modules.Portfolios.Infrastructure.Configurations
{
    public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
    {
        public void Configure(EntityTypeBuilder<Portfolio> builder)
        {
            builder.ToTable("Portfolios");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.CashBalance)
                .HasPrecision(18, 2);

            builder.Property(p => p.CreatedAtUtc)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relationship: one portfolio has many holdings; cascade delete
            builder.HasMany(p => p.Holdings)
                   .WithOne(h => h.Portfolio)
                   .HasForeignKey(h => h.PortfolioId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Optional: unique portfolio name per user
            builder.HasIndex(p => new { p.UserId, p.Name }).IsUnique();
        }
    }
}