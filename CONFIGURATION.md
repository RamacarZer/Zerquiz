# Zerquiz - Configuration Guide

## Environment Variables Setup

For security reasons, all sensitive information has been moved to environment variables. 

### Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual values:
   - `DB_USERNAME`: Your PostgreSQL username
   - `DB_PASSWORD`: Your PostgreSQL password
   - `JWT_SECRET_KEY`: A strong secret key (minimum 32 characters)

### appsettings.json Configuration

The appsettings.json files use placeholders like `${DB_USERNAME}` and `${DB_PASSWORD}`. 

**For Development:**
Create `appsettings.Development.json` in each service directory with your actual values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zerquiz_db;Username=your_user;Password=your_password;Search Path=service_schema"
  },
  "Jwt": {
    "SecretKey": "YourActualSecretKey",
    "Issuer": "Zerquiz",
    "Audience": "ZerquizApi"
  }
}
```

**Note:** `appsettings.Development.json` files are in `.gitignore` and will NOT be committed to Git.

## Services and Schemas

Each service uses its own PostgreSQL schema:

- **Core Service** - `core_schema` (Port: 5001)
- **Identity Service** - `identity_schema` (Port: 5002)
- **Curriculum Service** - `curriculum_schema` (Port: 5003)
- **Questions Service** - `questions_schema` (Port: 5004)
- **Exams Service** - `exams_schema` (Port: 5005)
- **Grading Service** - `grading_schema` (Port: 5006)
- **Royalty Service** - `royalty_schema` (Port: 5007)

## Security Best Practices

1. ✅ Never commit actual passwords or API keys
2. ✅ Use strong, unique passwords for each service
3. ✅ Keep your `.env` file secure and never share it
4. ✅ Use different credentials for development and production
5. ✅ Rotate your JWT secret keys regularly

## Production Deployment

For production, use proper secret management services:
- Azure Key Vault
- AWS Secrets Manager
- HashiCorp Vault
- Or your cloud provider's secret management solution

