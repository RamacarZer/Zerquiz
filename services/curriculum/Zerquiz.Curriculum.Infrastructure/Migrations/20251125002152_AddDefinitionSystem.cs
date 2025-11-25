using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Curriculum.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefinitionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "translations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "translations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "topics",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "topics",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "subjects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "subjects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "learning_outcomes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "learning_outcomes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "education_models",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "education_models",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppId",
                schema: "curriculum_schema",
                table: "curricula",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "curricula",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "definition_groups",
                schema: "curriculum_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: true),
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
                    CorrelationId = table.Column<string>(type: "text", nullable: true),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: true),
                    AppId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_definition_groups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "definition_group_translations",
                schema: "curriculum_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    DefinitionGroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_definition_group_translations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_definition_group_translations_definition_groups_DefinitionG~",
                        column: x => x.DefinitionGroupId,
                        principalSchema: "curriculum_schema",
                        principalTable: "definition_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "definitions",
                schema: "curriculum_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    AltNames = table.Column<string[]>(type: "text[]", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ValidTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: true),
                    AppId = table.Column<Guid>(type: "uuid", nullable: true),
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
                    table.PrimaryKey("PK_definitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_definitions_definition_groups_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "curriculum_schema",
                        principalTable: "definition_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_definitions_definitions_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "curriculum_schema",
                        principalTable: "definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "definition_translations",
                schema: "curriculum_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    DefinitionId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_definition_translations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_definition_translations_definitions_DefinitionId",
                        column: x => x.DefinitionId,
                        principalSchema: "curriculum_schema",
                        principalTable: "definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_definition_group_translations_DefinitionGroupId",
                schema: "curriculum_schema",
                table: "definition_group_translations",
                column: "DefinitionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_definition_group_translations_TenantId_DefinitionGroupId_La~",
                schema: "curriculum_schema",
                table: "definition_group_translations",
                columns: new[] { "TenantId", "DefinitionGroupId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_definition_groups_TenantId_Code",
                schema: "curriculum_schema",
                table: "definition_groups",
                columns: new[] { "TenantId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_definition_translations_DefinitionId",
                schema: "curriculum_schema",
                table: "definition_translations",
                column: "DefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_definition_translations_TenantId_DefinitionId_LanguageCode",
                schema: "curriculum_schema",
                table: "definition_translations",
                columns: new[] { "TenantId", "DefinitionId", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_definitions_GroupId",
                schema: "curriculum_schema",
                table: "definitions",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_definitions_ParentId",
                schema: "curriculum_schema",
                table: "definitions",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_definitions_TenantId_GroupId",
                schema: "curriculum_schema",
                table: "definitions",
                columns: new[] { "TenantId", "GroupId" });

            migrationBuilder.CreateIndex(
                name: "IX_definitions_TenantId_GroupKey_Code",
                schema: "curriculum_schema",
                table: "definitions",
                columns: new[] { "TenantId", "GroupKey", "Code" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "definition_group_translations",
                schema: "curriculum_schema");

            migrationBuilder.DropTable(
                name: "definition_translations",
                schema: "curriculum_schema");

            migrationBuilder.DropTable(
                name: "definitions",
                schema: "curriculum_schema");

            migrationBuilder.DropTable(
                name: "definition_groups",
                schema: "curriculum_schema");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "translations");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "translations");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "topics");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "topics");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "subjects");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "subjects");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "learning_outcomes");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "learning_outcomes");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "education_models");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "education_models");

            migrationBuilder.DropColumn(
                name: "AppId",
                schema: "curriculum_schema",
                table: "curricula");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                schema: "curriculum_schema",
                table: "curricula");
        }
    }
}
