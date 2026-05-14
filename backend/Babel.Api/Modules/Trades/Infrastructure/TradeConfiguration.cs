using Babel.Api.Modules.Trades.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Babel.Api.Modules.Trades.Infrastructure.Configurations;

public class TradeConfiguration : IEntityTypeConfiguration<Trade>
{
    public void Configure(EntityTypeBuilder<Trade> builder)
    {
        builder.ToTable("Trades");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PortfolioId)
            .IsRequired();

        builder.Property(x => x.AssetId)
            .IsRequired();

        builder.Property(x => x.Side)
            .IsRequired();

        builder.Property(x => x.Price)
            .HasPrecision(18, 2);

        builder.Property(x => x.Quantity)
            .HasPrecision(18, 8);

        builder.Property(x => x.TotalAmount)
            .HasPrecision(18, 2);

        builder.Property(x => x.ExecutedAtUtc)
            .IsRequired();

        builder.Property(x => x.QuoteAsOfUtc);

        // Indexes 
        builder.HasIndex(x => x.PortfolioId);
        builder.HasIndex(x => x.AssetId);
        builder.HasIndex(x => x.ExecutedAtUtc);

        // Optional composite index for common queries
        builder.HasIndex(x => new { x.PortfolioId, x.ExecutedAtUtc });
    }
}