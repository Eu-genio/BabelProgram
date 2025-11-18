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

        // Later you can override OnModelCreating for custom config.
    }
}
