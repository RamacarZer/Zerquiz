using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Identity.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIdentitySchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "identity_schema",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "identity_schema",
                table: "user_roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "user_roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "identity_schema",
                table: "roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "identity_schema",
                table: "positions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "positions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "identity_schema",
                table: "departments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "departments",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "identity_schema",
                table: "user_roles");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "user_roles");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "identity_schema",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "identity_schema",
                table: "positions");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "positions");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "identity_schema",
                table: "departments");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "identity_schema",
                table: "departments");
        }
    }
}
