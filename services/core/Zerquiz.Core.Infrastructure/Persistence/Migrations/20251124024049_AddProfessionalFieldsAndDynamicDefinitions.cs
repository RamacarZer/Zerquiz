using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Core.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionalFieldsAndDynamicDefinitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "core_schema",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CorrelationId",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                schema: "core_schema",
                table: "tenants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "core_schema",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                schema: "core_schema",
                table: "tenants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                schema: "core_schema",
                table: "tenants",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Tags",
                schema: "core_schema",
                table: "tenants",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                schema: "core_schema",
                table: "tenants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserAgent",
                schema: "core_schema",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                schema: "core_schema",
                table: "tenants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CorrelationId",
                schema: "core_schema",
                table: "audit_logs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                schema: "core_schema",
                table: "audit_logs",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                schema: "core_schema",
                table: "audit_logs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                schema: "core_schema",
                table: "audit_logs",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "system_definitions",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    NameEn = table.Column<string>(type: "text", nullable: true),
                    NameTr = table.Column<string>(type: "text", nullable: true),
                    NameAr = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: true),
                    DescriptionTr = table.Column<string>(type: "text", nullable: true),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "text", nullable: true),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    ConfigurationJson = table.Column<string>(type: "jsonb", nullable: true),
                    IsSystemReserved = table.Column<bool>(type: "boolean", nullable: false),
                    IsEditable = table.Column<bool>(type: "boolean", nullable: false),
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
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_definitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_system_definitions_system_definitions_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "core_schema",
                        principalTable: "system_definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "system_parameters",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    DataType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsEncrypted = table.Column<bool>(type: "boolean", nullable: false),
                    IsEditable = table.Column<bool>(type: "boolean", nullable: false),
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
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_parameters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "translations",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    FieldName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LanguageCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    TranslatedValue = table.Column<string>(type: "text", nullable: false),
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
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_translations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_EntityName_EntityId",
                schema: "core_schema",
                table: "audit_logs",
                columns: new[] { "EntityName", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_system_definitions_Category",
                schema: "core_schema",
                table: "system_definitions",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_system_definitions_Category_Code",
                schema: "core_schema",
                table: "system_definitions",
                columns: new[] { "Category", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_system_definitions_ParentId",
                schema: "core_schema",
                table: "system_definitions",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_system_definitions_TenantId_Category",
                schema: "core_schema",
                table: "system_definitions",
                columns: new[] { "TenantId", "Category" });

            migrationBuilder.CreateIndex(
                name: "IX_system_parameters_Category",
                schema: "core_schema",
                table: "system_parameters",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_system_parameters_Category_Key",
                schema: "core_schema",
                table: "system_parameters",
                columns: new[] { "Category", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_translations_EntityType_EntityId_FieldName_LanguageCode",
                schema: "core_schema",
                table: "translations",
                columns: new[] { "EntityType", "EntityId", "FieldName", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_translations_TenantId_EntityType",
                schema: "core_schema",
                table: "translations",
                columns: new[] { "TenantId", "EntityType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "system_definitions",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "system_parameters",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "translations",
                schema: "core_schema");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_EntityName_EntityId",
                schema: "core_schema",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "CorrelationId",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Metadata",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "RequestId",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Source",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Tags",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "UserAgent",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Version",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "CorrelationId",
                schema: "core_schema",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "Metadata",
                schema: "core_schema",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "RequestId",
                schema: "core_schema",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "Source",
                schema: "core_schema",
                table: "audit_logs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "core_schema",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");
        }
    }
}
