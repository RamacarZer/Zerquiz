using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Core.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedMissingEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionEndDate",
                schema: "core_schema",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionStartDate",
                schema: "core_schema",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubscriptionStatus",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                schema: "core_schema",
                table: "tenants",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "license_packages",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    MonthlyPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    YearlyPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    MaxUsers = table.Column<int>(type: "integer", nullable: false),
                    MaxStudents = table.Column<int>(type: "integer", nullable: false),
                    MaxQuestions = table.Column<int>(type: "integer", nullable: false),
                    MaxExams = table.Column<int>(type: "integer", nullable: false),
                    MaxStorage = table.Column<int>(type: "integer", nullable: false),
                    FeaturesJson = table.Column<string>(type: "jsonb", nullable: true),
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
                    table.PrimaryKey("PK_license_packages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "system_features",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RequiresLicense = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_system_features", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user_permissions",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PermissionCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ResourceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ResourceId = table.Column<Guid>(type: "uuid", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GrantedBy = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_user_permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tenant_licenses",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    LicensePackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    LicenseKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsTrial = table.Column<bool>(type: "boolean", nullable: false),
                    CurrentUsers = table.Column<int>(type: "integer", nullable: false),
                    CurrentStudents = table.Column<int>(type: "integer", nullable: false),
                    CurrentQuestions = table.Column<int>(type: "integer", nullable: false),
                    CurrentExams = table.Column<int>(type: "integer", nullable: false),
                    CurrentStorageUsed = table.Column<long>(type: "bigint", nullable: false),
                    CustomMaxUsers = table.Column<int>(type: "integer", nullable: true),
                    CustomMaxStudents = table.Column<int>(type: "integer", nullable: true),
                    CustomMaxQuestions = table.Column<int>(type: "integer", nullable: true),
                    CustomMaxExams = table.Column<int>(type: "integer", nullable: true),
                    CustomMaxStorage = table.Column<long>(type: "bigint", nullable: true),
                    CustomFeaturesJson = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_licenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tenant_licenses_license_packages_LicensePackageId",
                        column: x => x.LicensePackageId,
                        principalSchema: "core_schema",
                        principalTable: "license_packages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tenant_licenses_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "core_schema",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_license_packages_Code",
                schema: "core_schema",
                table: "license_packages",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_system_features_Category",
                schema: "core_schema",
                table: "system_features",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_system_features_Code",
                schema: "core_schema",
                table: "system_features",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_ExpiryDate",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_LicenseKey",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "LicenseKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_LicensePackageId",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "LicensePackageId");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_TenantId",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_TenantId_IsActive",
                schema: "core_schema",
                table: "tenant_licenses",
                columns: new[] { "TenantId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_user_permissions_PermissionCode",
                schema: "core_schema",
                table: "user_permissions",
                column: "PermissionCode");

            migrationBuilder.CreateIndex(
                name: "IX_user_permissions_UserId",
                schema: "core_schema",
                table: "user_permissions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_permissions_UserId_PermissionCode",
                schema: "core_schema",
                table: "user_permissions",
                columns: new[] { "UserId", "PermissionCode" });

            migrationBuilder.CreateIndex(
                name: "IX_user_permissions_UserId_ResourceType_ResourceId",
                schema: "core_schema",
                table: "user_permissions",
                columns: new[] { "UserId", "ResourceType", "ResourceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "system_features",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "tenant_licenses",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "user_permissions",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "license_packages",
                schema: "core_schema");

            migrationBuilder.DropColumn(
                name: "Address",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "City",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Country",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Email",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Phone",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "SubscriptionEndDate",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "SubscriptionStartDate",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "SubscriptionStatus",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "TaxNumber",
                schema: "core_schema",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "Website",
                schema: "core_schema",
                table: "tenants");
        }
    }
}
