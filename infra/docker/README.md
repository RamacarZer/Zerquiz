# Zerquiz Infrastructure

## Prerequisites

- Docker Desktop + Docker Compose
- Ya da yerel PostgreSQL 17 (Docker gerekli değil)

> 🛈 RabbitMQ ve Redis servisleri devre dışı bırakıldı. Bu klasör artık yalnızca PostgreSQL kurulumunu otomatikleştirmek için kullanılıyor.

## Setup Instructions

### 1. PostgreSQL Konteynerini Başlat (Opsiyonel)

```bash
cd infra/docker
docker compose up -d
```

Bu komut `zerquiz_postgres` konteynerini 5432 portuna map eder ve veriyi `postgres_data` volumüne kaydeder. Eğer zaten lokal PostgreSQL kullanıyorsanız bu adımı atlayabilirsiniz.

### 2. Setup PostgreSQL Database

Run the database setup script to create schemas and users:

```bash
# For Windows (PowerShell)
$env:PGPASSWORD="Sanez.579112"
psql -h localhost -U postgres -f setup-database.sql

# For Linux/Mac
PGPASSWORD="Sanez.579112" psql -h localhost -U postgres -f setup-database.sql
```

This script will:
- Create `zerquiz_db` database
- Create 7 schemas (core_schema, identity_schema, curriculum_schema, questions_schema, exams_schema, grading_schema, royalty_schema)
- Create service-specific users with appropriate permissions
- Enable required PostgreSQL extensions (uuid-ossp, pg_trgm)

### 3. Verify Setup

**Check PostgreSQL Schemas:**
```bash
$env:PGPASSWORD="Sanez.579112"
psql -h localhost -U postgres -d zerquiz_db -c "\dn"
```

## Connection Strings

Each microservice will use its own connection string:

```
Core Service:       Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_core;Password=core_pass_2024;Search Path=core_schema
Identity Service:   Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_identity;Password=identity_pass_2024;Search Path=identity_schema
Curriculum Service: Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_curriculum;Password=curriculum_pass_2024;Search Path=curriculum_schema
Questions Service:  Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_questions;Password=questions_pass_2024;Search Path=questions_schema
Exams Service:      Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_exams;Password=exams_pass_2024;Search Path=exams_schema
Grading Service:    Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_grading;Password=grading_pass_2024;Search Path=grading_schema
Royalty Service:    Host=localhost;Port=5432;Database=zerquiz_db;Username=zerquiz_royalty;Password=royalty_pass_2024;Search Path=royalty_schema
```

## Troubleshooting

### PostgreSQL permission issues
Re-run the setup script or manually grant permissions using psql.

## Cleanup

To remove the PostgreSQL container and volume:
```bash
docker compose down -v
```

Note: This does NOT affect your external/local PostgreSQL installation.

