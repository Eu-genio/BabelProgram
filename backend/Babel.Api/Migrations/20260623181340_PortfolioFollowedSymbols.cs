using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Babel.Api.Migrations
{
    /// <inheritdoc />
    public partial class PortfolioFollowedSymbols : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PortfolioFollowedSymbols",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PortfolioId = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false),
                    FollowedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioFollowedSymbols", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioFollowedSymbols_PortfolioId",
                table: "PortfolioFollowedSymbols",
                column: "PortfolioId");

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioFollowedSymbols_PortfolioId_AssetId",
                table: "PortfolioFollowedSymbols",
                columns: new[] { "PortfolioId", "AssetId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortfolioFollowedSymbols");
        }
    }
}
