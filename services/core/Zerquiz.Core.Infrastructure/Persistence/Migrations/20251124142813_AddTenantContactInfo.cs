using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Core.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantContactInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RepresentativeEmail",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepresentativeFirstName",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepresentativeLastName",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepresentativePhone",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepresentativeTitle",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalContactEmail",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalContactFirstName",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalContactLastName",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalContactPhone",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalContactTitle",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepresentativeEmail",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "RepresentativeFirstName",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "RepresentativeLastName",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "RepresentativePhone",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "RepresentativeTitle",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TechnicalContactEmail",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TechnicalContactFirstName",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TechnicalContactLastName",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TechnicalContactPhone",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TechnicalContactTitle",
                schema: "core_schema",
                table: "tenants");
        }
    }
}
