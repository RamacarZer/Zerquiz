using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Core.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLicenseAndBrandingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropTable(
                name: "system_features",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "user_permissions",
                schema: "core_schema");

            migrationBuilder.DropIndex(
                name: "IX_tenant_licenses_LicenseKey",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropIndex(
                name: "IX_tenant_licenses_TenantId_IsActive",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CurrentExams",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CurrentQuestions",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CurrentStorageUsed",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CurrentStudents",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomMaxExams",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomMaxQuestions",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomMaxStorage",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomMaxStudents",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomMaxUsers",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "LicenseKey",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "FeaturesJson",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.RenameColumn(
                name: "IsTrial",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "AutoRenew");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "CurrentUsers",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "Version");

            migrationBuilder.RenameIndex(
                name: "IX_tenant_licenses_ExpiryDate",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "IX_tenant_licenses_EndDate");

            migrationBuilder.RenameColumn(
                name: "MaxStorage",
                schema: "core_schema",
                table: "license_packages",
                newName: "TrialDays");

            migrationBuilder.AlterColumn<Guid>(
                name: "TenantId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "BillingPeriod",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CancellationReason",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancelledAt",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CorrelationId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentUsageJson",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomLimitsJson",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextBillingDate",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "SuspendedAt",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId1",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TrialEndDate",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserAgent",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "core_schema",
                table: "license_packages",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string[]>(
                name: "Features",
                schema: "core_schema",
                table: "license_packages",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HighlightText",
                schema: "core_schema",
                table: "license_packages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsHighlighted",
                schema: "core_schema",
                table: "license_packages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                schema: "core_schema",
                table: "license_packages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxApiCallsPerMonth",
                schema: "core_schema",
                table: "license_packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxCases",
                schema: "core_schema",
                table: "license_packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxDocuments",
                schema: "core_schema",
                table: "license_packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxModules",
                schema: "core_schema",
                table: "license_packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxStorageGB",
                schema: "core_schema",
                table: "license_packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "invoices",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LicenseId = table.Column<Guid>(type: "uuid", nullable: true),
                    InvoiceNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BillingPeriodStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BillingPeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Subtotal = table.Column<decimal>(type: "numeric", nullable: false),
                    TaxRate = table.Column<decimal>(type: "numeric", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PaymentMethod = table.Column<string>(type: "text", nullable: true),
                    PaymentReference = table.Column<string>(type: "text", nullable: true),
                    ItemsJson = table.Column<string>(type: "jsonb", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    InternalNotes = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invoices_tenant_licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalSchema: "core_schema",
                        principalTable: "tenant_licenses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_invoices_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "core_schema",
                        principalTable: "tenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tenant_branding_settings",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Subdomain = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CustomDomain = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    DomainVerified = table.Column<bool>(type: "boolean", nullable: false),
                    LogoUrl = table.Column<string>(type: "text", nullable: true),
                    LogoLightUrl = table.Column<string>(type: "text", nullable: true),
                    LogoDarkUrl = table.Column<string>(type: "text", nullable: true),
                    FaviconUrl = table.Column<string>(type: "text", nullable: true),
                    LoginBackgroundUrl = table.Column<string>(type: "text", nullable: true),
                    DashboardBannerUrl = table.Column<string>(type: "text", nullable: true),
                    MetaTitle = table.Column<string>(type: "text", nullable: true),
                    MetaDescription = table.Column<string>(type: "text", nullable: true),
                    MetaKeywords = table.Column<string>(type: "text", nullable: true),
                    EmailSenderName = table.Column<string>(type: "text", nullable: true),
                    EmailSenderAddress = table.Column<string>(type: "text", nullable: true),
                    EmailLogoUrl = table.Column<string>(type: "text", nullable: true),
                    EmailFooterText = table.Column<string>(type: "text", nullable: true),
                    FacebookUrl = table.Column<string>(type: "text", nullable: true),
                    TwitterUrl = table.Column<string>(type: "text", nullable: true),
                    LinkedinUrl = table.Column<string>(type: "text", nullable: true),
                    InstagramUrl = table.Column<string>(type: "text", nullable: true),
                    SupportEmail = table.Column<string>(type: "text", nullable: true),
                    SupportPhone = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    ColorThemeJson = table.Column<string>(type: "jsonb", nullable: true),
                    AdvancedSettingsJson = table.Column<string>(type: "jsonb", nullable: true),
                    DefaultLanguage = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    DefaultTimezone = table.Column<string>(type: "text", nullable: false),
                    DefaultCurrency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    DateFormat = table.Column<string>(type: "text", nullable: false),
                    TimeFormat = table.Column<string>(type: "text", nullable: false),
                    FeatureFlagsJson = table.Column<string>(type: "jsonb", nullable: true),
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
                    table.PrimaryKey("PK_tenant_branding_settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tenant_branding_settings_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "core_schema",
                        principalTable: "tenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "usage_tracking",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    TrackingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrackingHour = table.Column<int>(type: "integer", nullable: true),
                    MetricsJson = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usage_tracking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_usage_tracking_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "core_schema",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_Status",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_TenantId_Status",
                schema: "core_schema",
                table: "tenant_licenses",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_TenantId1",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "TenantId1");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_DueDate",
                schema: "core_schema",
                table: "invoices",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_InvoiceNumber",
                schema: "core_schema",
                table: "invoices",
                column: "InvoiceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_invoices_LicenseId",
                schema: "core_schema",
                table: "invoices",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_Status",
                schema: "core_schema",
                table: "invoices",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_TenantId",
                schema: "core_schema",
                table: "invoices",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_branding_settings_CustomDomain",
                schema: "core_schema",
                table: "tenant_branding_settings",
                column: "CustomDomain");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_branding_settings_Subdomain",
                schema: "core_schema",
                table: "tenant_branding_settings",
                column: "Subdomain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tenant_branding_settings_TenantId",
                schema: "core_schema",
                table: "tenant_branding_settings",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usage_tracking_TenantId_TrackingDate_TrackingHour",
                schema: "core_schema",
                table: "usage_tracking",
                columns: new[] { "TenantId", "TrackingDate", "TrackingHour" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usage_tracking_TrackingDate",
                schema: "core_schema",
                table: "usage_tracking",
                column: "TrackingDate");

            migrationBuilder.AddForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "TenantId",
                principalSchema: "core_schema",
                principalTable: "tenants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId1",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "TenantId1",
                principalSchema: "core_schema",
                principalTable: "tenants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId1",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropTable(
                name: "invoices",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "tenant_branding_settings",
                schema: "core_schema");

            migrationBuilder.DropTable(
                name: "usage_tracking",
                schema: "core_schema");

            migrationBuilder.DropIndex(
                name: "IX_tenant_licenses_Status",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropIndex(
                name: "IX_tenant_licenses_TenantId_Status",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropIndex(
                name: "IX_tenant_licenses_TenantId1",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Amount",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "BillingPeriod",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CancellationReason",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CancelledAt",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CorrelationId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Currency",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CurrentUsageJson",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "CustomLimitsJson",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "NextBillingDate",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Notes",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "RequestId",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Source",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "SuspendedAt",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "TenantId1",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "TrialEndDate",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "UserAgent",
                schema: "core_schema",
                table: "tenant_licenses");

            migrationBuilder.DropColumn(
                name: "Features",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "HighlightText",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "IsHighlighted",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "MaxApiCallsPerMonth",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "MaxCases",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "MaxDocuments",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "MaxModules",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.DropColumn(
                name: "MaxStorageGB",
                schema: "core_schema",
                table: "license_packages");

            migrationBuilder.RenameColumn(
                name: "Version",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "CurrentUsers");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "ExpiryDate");

            migrationBuilder.RenameColumn(
                name: "AutoRenew",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "IsTrial");

            migrationBuilder.RenameIndex(
                name: "IX_tenant_licenses_EndDate",
                schema: "core_schema",
                table: "tenant_licenses",
                newName: "IX_tenant_licenses_ExpiryDate");

            migrationBuilder.RenameColumn(
                name: "TrialDays",
                schema: "core_schema",
                table: "license_packages",
                newName: "MaxStorage");

            migrationBuilder.AlterColumn<Guid>(
                name: "TenantId",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentExams",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentQuestions",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "CurrentStorageUsed",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "CurrentStudents",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CustomMaxExams",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomMaxQuestions",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "CustomMaxStorage",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomMaxStudents",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomMaxUsers",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LicenseKey",
                schema: "core_schema",
                table: "tenant_licenses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "core_schema",
                table: "license_packages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeaturesJson",
                schema: "core_schema",
                table: "license_packages",
                type: "jsonb",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "system_features",
                schema: "core_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CorrelationId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    RequiresLicense = table.Column<bool>(type: "boolean", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false)
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
                    CorrelationId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GrantedBy = table.Column<string>(type: "text", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    PermissionCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    RequestId = table.Column<string>(type: "text", nullable: true),
                    ResourceId = table.Column<Guid>(type: "uuid", nullable: true),
                    ResourceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Source = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_permissions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_LicenseKey",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "LicenseKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tenant_licenses_TenantId_IsActive",
                schema: "core_schema",
                table: "tenant_licenses",
                columns: new[] { "TenantId", "IsActive" });

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

            migrationBuilder.AddForeignKey(
                name: "FK_tenant_licenses_tenants_TenantId",
                schema: "core_schema",
                table: "tenant_licenses",
                column: "TenantId",
                principalSchema: "core_schema",
                principalTable: "tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
