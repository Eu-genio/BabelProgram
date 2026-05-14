using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Babel.Api.Migrations
{
    /// <inheritdoc />
    public partial class TradeQuoteAsOfUtc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "QuoteAsOfUtc",
                table: "Trades",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuoteAsOfUtc",
                table: "Trades");
        }
    }
}
