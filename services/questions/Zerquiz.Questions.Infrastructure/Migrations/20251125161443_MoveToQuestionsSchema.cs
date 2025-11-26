using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Questions.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveToQuestionsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "questions_schema");

            migrationBuilder.RenameTable(
                name: "questions",
                newName: "questions",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_versions",
                newName: "question_versions",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_solutions",
                newName: "question_solutions",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_reviews",
                newName: "question_reviews",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_pedagogical_types",
                newName: "question_pedagogical_types",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_format_types",
                newName: "question_format_types",
                newSchema: "questions_schema");

            migrationBuilder.RenameTable(
                name: "question_assets",
                newName: "question_assets",
                newSchema: "questions_schema");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "questions",
                schema: "questions_schema",
                newName: "questions");

            migrationBuilder.RenameTable(
                name: "question_versions",
                schema: "questions_schema",
                newName: "question_versions");

            migrationBuilder.RenameTable(
                name: "question_solutions",
                schema: "questions_schema",
                newName: "question_solutions");

            migrationBuilder.RenameTable(
                name: "question_reviews",
                schema: "questions_schema",
                newName: "question_reviews");

            migrationBuilder.RenameTable(
                name: "question_pedagogical_types",
                schema: "questions_schema",
                newName: "question_pedagogical_types");

            migrationBuilder.RenameTable(
                name: "question_format_types",
                schema: "questions_schema",
                newName: "question_format_types");

            migrationBuilder.RenameTable(
                name: "question_assets",
                schema: "questions_schema",
                newName: "question_assets");
        }
    }
}
