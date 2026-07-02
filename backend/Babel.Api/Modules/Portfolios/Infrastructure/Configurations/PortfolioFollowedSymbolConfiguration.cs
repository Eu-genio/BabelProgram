using Babel.Api.Modules.Portfolios.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Babel.Api.Modules.Portfolios.Infrastructure.Configurations;

public class PortfolioFollowedSymbolConfiguration : IEntityTypeConfiguration<PortfolioFollowedSymbol>
{
    public void Configure(EntityTypeBuilder<PortfolioFollowedSymbol> builder)
    {
        builder.ToTable("PortfolioFollowedSymbols");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PortfolioId).IsRequired();
        builder.Property(x => x.AssetId).IsRequired();
        builder.Property(x => x.FollowedAtUtc).IsRequired();

        builder.HasIndex(x => new { x.PortfolioId, x.AssetId }).IsUnique();
        builder.HasIndex(x => x.PortfolioId);
    }
}
