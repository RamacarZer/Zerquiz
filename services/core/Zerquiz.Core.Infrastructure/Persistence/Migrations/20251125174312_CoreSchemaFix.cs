using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Core.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CoreSchemaFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "translations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "translations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_themes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_themes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_branding_settings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_branding_settings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "system_parameters",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "system_parameters",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "system_definitions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "system_definitions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "license_packages",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "license_packages",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "core_schema",
                table: "invoices",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "core_schema",
                table: "invoices",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "translations");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "translations");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_themes");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_themes");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "tenant_branding_settings");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "tenant_branding_settings");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "system_parameters");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "system_parameters");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "system_definitions");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "system_definitions");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "core_schema",
                table: "invoices");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "core_schema",
                table: "invoices");
        }
    }
}
