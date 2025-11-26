using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zerquiz.Presentation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "presentation_schema");

            migrationBuilder.CreateTable(
                name: "presentations",
                schema: "presentation_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    Theme = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AllowStudentQuestions = table.Column<bool>(type: "boolean", nullable: false),
                    ShowProgressBar = table.Column<bool>(type: "boolean", nullable: false),
                    ShowSlideNumbers = table.Column<bool>(type: "boolean", nullable: false),
                    IsLive = table.Column<bool>(type: "boolean", nullable: false),
                    LiveCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    LiveStartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LiveEndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_presentations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "presentation_sessions",
                schema: "presentation_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PresentationId = table.Column<Guid>(type: "uuid", nullable: false),
                    PresenterUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CurrentSlideIndex = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SessionCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    TotalAttendees = table.Column<int>(type: "integer", nullable: false),
                    CurrentOnlineCount = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
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
                    table.PrimaryKey("PK_presentation_sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_presentation_sessions_presentations_PresentationId",
                        column: x => x.PresentationId,
                        principalSchema: "presentation_schema",
                        principalTable: "presentations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "slides",
                schema: "presentation_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PresentationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ImageCaption = table.Column<string>(type: "text", nullable: true),
                    LeftColumn = table.Column<string>(type: "text", nullable: true),
                    RightColumn = table.Column<string>(type: "text", nullable: true),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: true),
                    PollQuestion = table.Column<string>(type: "text", nullable: true),
                    PollOptions = table.Column<string>(type: "text", nullable: true),
                    Transition = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    SpeakerNotes = table.Column<string>(type: "text", nullable: true),
                    BackgroundColor = table.Column<string>(type: "text", nullable: true),
                    TextColor = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_slides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_slides_presentations_PresentationId",
                        column: x => x.PresentationId,
                        principalSchema: "presentation_schema",
                        principalTable: "presentations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "session_attendees",
                schema: "presentation_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LeftAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsOnline = table.Column<bool>(type: "boolean", nullable: false),
                    LastViewedSlideIndex = table.Column<int>(type: "integer", nullable: false),
                    LastActiveAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_session_attendees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_session_attendees_presentation_sessions_SessionId",
                        column: x => x.SessionId,
                        principalSchema: "presentation_schema",
                        principalTable: "presentation_sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "slide_interactions",
                schema: "presentation_schema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    SlideId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    InteractionType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Response = table.Column<string>(type: "text", nullable: true),
                    RespondedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("PK_slide_interactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_slide_interactions_presentation_sessions_SessionId",
                        column: x => x.SessionId,
                        principalSchema: "presentation_schema",
                        principalTable: "presentation_sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_presentation_sessions_IsActive",
                schema: "presentation_schema",
                table: "presentation_sessions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_presentation_sessions_PresentationId",
                schema: "presentation_schema",
                table: "presentation_sessions",
                column: "PresentationId");

            migrationBuilder.CreateIndex(
                name: "IX_presentation_sessions_SessionCode",
                schema: "presentation_schema",
                table: "presentation_sessions",
                column: "SessionCode",
                unique: true,
                filter: "\"SessionCode\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_presentations_CreatedAt",
                schema: "presentation_schema",
                table: "presentations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_presentations_LiveCode",
                schema: "presentation_schema",
                table: "presentations",
                column: "LiveCode",
                unique: true,
                filter: "\"LiveCode\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_presentations_TenantId",
                schema: "presentation_schema",
                table: "presentations",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_session_attendees_SessionId_UserId",
                schema: "presentation_schema",
                table: "session_attendees",
                columns: new[] { "SessionId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_slide_interactions_SessionId_SlideId_UserId",
                schema: "presentation_schema",
                table: "slide_interactions",
                columns: new[] { "SessionId", "SlideId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_slides_PresentationId_Order",
                schema: "presentation_schema",
                table: "slides",
                columns: new[] { "PresentationId", "Order" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "session_attendees",
                schema: "presentation_schema");

            migrationBuilder.DropTable(
                name: "slide_interactions",
                schema: "presentation_schema");

            migrationBuilder.DropTable(
                name: "slides",
                schema: "presentation_schema");

            migrationBuilder.DropTable(
                name: "presentation_sessions",
                schema: "presentation_schema");

            migrationBuilder.DropTable(
                name: "presentations",
                schema: "presentation_schema");
        }
    }
}
