using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Identity.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentsAndPositions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                schema: "identity_schema",
                table: "users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                schema: "identity_schema",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                schema: "identity_schema",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                schema: "identity_schema",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                schema: "identity_schema",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                schema: "identity_schema",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentityNumber",
                schema: "identity_schema",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PositionId",
                schema: "identity_schema",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PrimaryRoleId",
                schema: "identity_schema",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "departments",
                schema: "identity_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ParentDepartmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_departments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_departments_departments_ParentDepartmentId",
                        column: x => x.ParentDepartmentId,
                        principalSchema: "identity_schema",
                        principalTable: "departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "positions",
                schema: "identity_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_positions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_users_DepartmentId",
                schema: "identity_schema",
                table: "users",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_users_PositionId",
                schema: "identity_schema",
                table: "users",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_users_PrimaryRoleId",
                schema: "identity_schema",
                table: "users",
                column: "PrimaryRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_departments_ParentDepartmentId",
                schema: "identity_schema",
                table: "departments",
                column: "ParentDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_departments_TenantId_Code",
                schema: "identity_schema",
                table: "departments",
                columns: new[] { "TenantId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_positions_Level",
                schema: "identity_schema",
                table: "positions",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "IX_positions_TenantId_Code",
                schema: "identity_schema",
                table: "positions",
                columns: new[] { "TenantId", "Code" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_users_departments_DepartmentId",
                schema: "identity_schema",
                table: "users",
                column: "DepartmentId",
                principalSchema: "identity_schema",
                principalTable: "departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_users_positions_PositionId",
                schema: "identity_schema",
                table: "users",
                column: "PositionId",
                principalSchema: "identity_schema",
                principalTable: "positions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_users_roles_PrimaryRoleId",
                schema: "identity_schema",
                table: "users",
                column: "PrimaryRoleId",
                principalSchema: "identity_schema",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_departments_DepartmentId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropForeignKey(
                name: "FK_users_positions_PositionId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropForeignKey(
                name: "FK_users_roles_PrimaryRoleId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropTable(
                name: "departments",
                schema: "identity_schema");

            migrationBuilder.DropTable(
                name: "positions",
                schema: "identity_schema");

            migrationBuilder.DropIndex(
                name: "IX_users_DepartmentId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_PositionId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_PrimaryRoleId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Address",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "City",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Country",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Gender",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "IdentityNumber",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "PositionId",
                schema: "identity_schema",
                table: "users");

            migrationBuilder.DropColumn(
                name: "PrimaryRoleId",
                schema: "identity_schema",
                table: "users");
        }
    }
}
