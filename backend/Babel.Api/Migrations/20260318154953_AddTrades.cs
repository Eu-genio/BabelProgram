using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Babel.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTrades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateAtUtc",
                table: "Portfolios");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Portfolios",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.CreateTable(
                name: "Trades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PortfolioId = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false),
                    Side = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<decimal>(type: "TEXT", precision: 18, scale: 8, nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    ExecutedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trades", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Portfolios_UserId_Name",
                table: "Portfolios",
                columns: new[] { "UserId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioHoldings_PortfolioId_AssetId",
                table: "PortfolioHoldings",
                columns: new[] { "PortfolioId", "AssetId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trades_AssetId",
                table: "Trades",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_Trades_ExecutedAtUtc",
                table: "Trades",
                column: "ExecutedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Trades_PortfolioId",
                table: "Trades",
                column: "PortfolioId");

            migrationBuilder.CreateIndex(
                name: "IX_Trades_PortfolioId_ExecutedAtUtc",
                table: "Trades",
                columns: new[] { "PortfolioId", "ExecutedAtUtc" });

            migrationBuilder.AddForeignKey(
                name: "FK_PortfolioHoldings_Portfolios_PortfolioId",
                table: "PortfolioHoldings",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PortfolioHoldings_Portfolios_PortfolioId",
                table: "PortfolioHoldings");

            migrationBuilder.DropTable(
                name: "Trades");

            migrationBuilder.DropIndex(
                name: "IX_Portfolios_UserId_Name",
                table: "Portfolios");

            migrationBuilder.DropIndex(
                name: "IX_PortfolioHoldings_PortfolioId_AssetId",
                table: "PortfolioHoldings");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Portfolios");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAtUtc",
                table: "Portfolios",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
