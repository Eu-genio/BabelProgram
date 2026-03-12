using Babel.Api.Modules.Users.Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Babel.Api.Modules.Assets.Domain;

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
    }
}
