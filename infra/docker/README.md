# Zerquiz Infrastructure

## Prerequisites

- Docker & Docker Compose installed
- PostgreSQL running on localhost:5432 (already available via Docker)

## Setup Instructions

### 1. Start Supporting Services (RabbitMQ & Redis)

```bash
cd infra/docker
docker-compose up -d
```

This will start:
- **RabbitMQ**: Message broker for inter-service communication
  - AMQP Port: 5672
  - Management UI: http://localhost:15672 (user: zerquiz, pass: zerquiz_pass)
- **Redis**: Caching and session storage
  - Port: 6379

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

**Check Docker Services:**
```bash
docker-compose ps
```

**Check PostgreSQL Schemas:**
```bash
$env:PGPASSWORD="Sanez.579112"
psql -h localhost -U postgres -d zerquiz_db -c "\dn"
```

**Test RabbitMQ:**
- Open http://localhost:15672 in browser
- Login with: zerquiz / zerquiz_pass

**Test Redis:**
```bash
docker exec -it zerquiz_redis redis-cli ping
# Should return: PONG
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

### RabbitMQ not starting
```bash
docker-compose down
docker volume prune
docker-compose up -d
```

### Redis connection issues
```bash
docker exec -it zerquiz_redis redis-cli
> AUTH default ""
> PING
```

### PostgreSQL permission issues
Re-run the setup script or manually grant permissions using psql.

## Cleanup

To remove all Docker services and volumes:
```bash
docker-compose down -v
```

Note: This does NOT affect your PostgreSQL database on localhost.

