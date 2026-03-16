using Babel.Api.Modules.Assets.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Babel.Api.Modules.Assets.Infrastructure;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.ToTable("Assets");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Symbol)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Exchange)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Currency)
            .HasMaxLength(10);

        builder.HasIndex(a => a.Symbol)
            .IsUnique();
    }
}