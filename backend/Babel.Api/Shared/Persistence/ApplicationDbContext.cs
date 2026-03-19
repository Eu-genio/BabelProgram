using Babel.Api.Modules.Assets.Domain;
using Babel.Api.Modules.Assets.Infrastructure;
using Babel.Api.Modules.Portfolios.Domain;
using Babel.Api.Modules.Portfolios.Infrastructure.Configurations;
using Babel.Api.Modules.Trades.Domain;
using Babel.Api.Modules.Trades.Infrastructure;
using Babel.Api.Modules.Trades.Infrastructure.Configurations;
using Babel.Api.Modules.Users.Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
namespace Babel.Api.Shared.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // DbSets = tables
        public DbSet<User> Users => Set<User>();
        public DbSet<Asset> Assets => Set<Asset>();
        // Later you can override OnModelCreating for custom config.
        public DbSet<Portfolio> Portfolios => Set<Portfolio>();
        public DbSet<PortfolioHolding> PortfolioHoldings => Set<PortfolioHolding>();
        public DbSet<Trade> Trades => Set<Trade>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            modelBuilder.ApplyConfiguration(new AssetConfiguration());
            modelBuilder.ApplyConfiguration(new PortfolioConfiguration());
            modelBuilder.ApplyConfiguration(new PortfolioHoldingConfiguration());
            modelBuilder.ApplyConfiguration(new TradeConfiguration());

        }
    }
}
