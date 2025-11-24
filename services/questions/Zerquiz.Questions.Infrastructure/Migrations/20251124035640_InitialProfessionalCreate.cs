using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Questions.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialProfessionalCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "questions_schema");

            migrationBuilder.CreateTable(
                name: "question_format_types",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ConfigSchema = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_format_types", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "question_pedagogical_types",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_pedagogical_types", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "questions",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FormatTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    PedagogicalTypeId = table.Column<Guid>(type: "uuid", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<Guid>(type: "uuid", nullable: true),
                    SubtopicId = table.Column<Guid>(type: "uuid", nullable: true),
                    LearningOutcomeId = table.Column<Guid>(type: "uuid", nullable: true),
                    CurriculumId = table.Column<Guid>(type: "uuid", nullable: true),
                    Difficulty = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Weight = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 1.0m),
                    QuestionStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CurrentVersionId = table.Column<Guid>(type: "uuid", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
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
                    table.PrimaryKey("PK_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_questions_question_format_types_FormatTypeId",
                        column: x => x.FormatTypeId,
                        principalSchema: "questions_schema",
                        principalTable: "question_format_types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_questions_question_pedagogical_types_PedagogicalTypeId",
                        column: x => x.PedagogicalTypeId,
                        principalSchema: "questions_schema",
                        principalTable: "question_pedagogical_types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "question_reviews",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReviewerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReviewStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Comments = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewFee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    IsFeePaid = table.Column<bool>(type: "boolean", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
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
                    table.PrimaryKey("PK_question_reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_question_reviews_questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "questions_schema",
                        principalTable: "questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "question_solutions",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Content = table.Column<string>(type: "jsonb", nullable: false),
                    Language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
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
                    table.PrimaryKey("PK_question_solutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_question_solutions_questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "questions_schema",
                        principalTable: "questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "question_versions",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    VersionNumber = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_versions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_question_versions_questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "questions_schema",
                        principalTable: "questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "question_assets",
                schema: "questions_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionVersionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    StorageKey = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    MimeType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Position = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
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
                    table.PrimaryKey("PK_question_assets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_question_assets_question_versions_QuestionVersionId",
                        column: x => x.QuestionVersionId,
                        principalSchema: "questions_schema",
                        principalTable: "question_versions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_question_assets_QuestionVersionId",
                schema: "questions_schema",
                table: "question_assets",
                column: "QuestionVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_question_assets_StorageKey",
                schema: "questions_schema",
                table: "question_assets",
                column: "StorageKey");

            migrationBuilder.CreateIndex(
                name: "IX_question_assets_TenantId_QuestionVersionId",
                schema: "questions_schema",
                table: "question_assets",
                columns: new[] { "TenantId", "QuestionVersionId" });

            migrationBuilder.CreateIndex(
                name: "IX_question_format_types_Code",
                schema: "questions_schema",
                table: "question_format_types",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_question_pedagogical_types_Code",
                schema: "questions_schema",
                table: "question_pedagogical_types",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_question_reviews_QuestionId",
                schema: "questions_schema",
                table: "question_reviews",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_question_reviews_ReviewedAt",
                schema: "questions_schema",
                table: "question_reviews",
                column: "ReviewedAt");

            migrationBuilder.CreateIndex(
                name: "IX_question_reviews_TenantId_QuestionId",
                schema: "questions_schema",
                table: "question_reviews",
                columns: new[] { "TenantId", "QuestionId" });

            migrationBuilder.CreateIndex(
                name: "IX_question_reviews_TenantId_ReviewerId",
                schema: "questions_schema",
                table: "question_reviews",
                columns: new[] { "TenantId", "ReviewerId" });

            migrationBuilder.CreateIndex(
                name: "IX_question_reviews_TenantId_ReviewStatus",
                schema: "questions_schema",
                table: "question_reviews",
                columns: new[] { "TenantId", "ReviewStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_question_solutions_QuestionId",
                schema: "questions_schema",
                table: "question_solutions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_question_solutions_TenantId_AuthorId",
                schema: "questions_schema",
                table: "question_solutions",
                columns: new[] { "TenantId", "AuthorId" });

            migrationBuilder.CreateIndex(
                name: "IX_question_solutions_TenantId_QuestionId",
                schema: "questions_schema",
                table: "question_solutions",
                columns: new[] { "TenantId", "QuestionId" });

            migrationBuilder.CreateIndex(
                name: "IX_question_versions_CreatedAt",
                schema: "questions_schema",
                table: "question_versions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_question_versions_QuestionId_VersionNumber",
                schema: "questions_schema",
                table: "question_versions",
                columns: new[] { "QuestionId", "VersionNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_question_versions_TenantId",
                schema: "questions_schema",
                table: "question_versions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_questions_FormatTypeId",
                schema: "questions_schema",
                table: "questions",
                column: "FormatTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_questions_PedagogicalTypeId",
                schema: "questions_schema",
                table: "questions",
                column: "PedagogicalTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_questions_PublishedAt",
                schema: "questions_schema",
                table: "questions",
                column: "PublishedAt");

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_Code",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_CurriculumId",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "CurriculumId" });

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_Difficulty",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "Difficulty" });

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_QuestionStatus",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "QuestionStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_SubjectId",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "SubjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_questions_TenantId_TopicId",
                schema: "questions_schema",
                table: "questions",
                columns: new[] { "TenantId", "TopicId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "question_assets",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "question_reviews",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "question_solutions",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "question_versions",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "questions",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "question_format_types",
                schema: "questions_schema");

            migrationBuilder.DropTable(
                name: "question_pedagogical_types",
                schema: "questions_schema");
        }
    }
}
