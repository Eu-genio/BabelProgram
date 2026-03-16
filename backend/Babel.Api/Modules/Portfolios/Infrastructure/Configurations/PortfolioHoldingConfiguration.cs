using Babel.Api.Modules.Portfolios.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Babel.Api.Modules.Portfolios.Infrastructure.Configurations;

public class PortfolioHoldingConfiguration : IEntityTypeConfiguration<PortfolioHolding>
{
    public void Configure(EntityTypeBuilder<PortfolioHolding> builder)
    {
        builder.ToTable("PortfolioHoldings");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Quantity)
            .HasPrecision(18, 8);

        builder.Property(x => x.AverageCost)
            .HasPrecision(18, 2);

        builder.HasIndex(x => new { x.PortfolioId, x.AssetId })
            .IsUnique();
    }
}