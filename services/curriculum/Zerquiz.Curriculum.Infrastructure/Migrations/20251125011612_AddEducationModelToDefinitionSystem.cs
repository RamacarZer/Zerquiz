using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Curriculum.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEducationModelToDefinitionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EducationModelId",
                schema: "curriculum_schema",
                table: "definitions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_definitions_EducationModelId",
                schema: "curriculum_schema",
                table: "definitions",
                column: "EducationModelId");

            migrationBuilder.CreateIndex(
                name: "IX_definition_groups_EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups",
                column: "EducationModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_definition_groups_education_models_EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups",
                column: "EducationModelId",
                principalSchema: "curriculum_schema",
                principalTable: "education_models",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_definitions_education_models_EducationModelId",
                schema: "curriculum_schema",
                table: "definitions",
                column: "EducationModelId",
                principalSchema: "curriculum_schema",
                principalTable: "education_models",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_definition_groups_education_models_EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_definitions_education_models_EducationModelId",
                schema: "curriculum_schema",
                table: "definitions");

            migrationBuilder.DropIndex(
                name: "IX_definitions_EducationModelId",
                schema: "curriculum_schema",
                table: "definitions");

            migrationBuilder.DropIndex(
                name: "IX_definition_groups_EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups");

            migrationBuilder.DropColumn(
                name: "EducationModelId",
                schema: "curriculum_schema",
                table: "definitions");

            migrationBuilder.DropColumn(
                name: "EducationModelId",
                schema: "curriculum_schema",
                table: "definition_groups");
        }
    }
}
