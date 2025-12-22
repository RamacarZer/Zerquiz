# API Gateway Configuration

## Ocelot Gateway Routes

### New Services Configuration

```json
{
  "Routes": [
    // Content Service (Port 5008)
    {
      "DownstreamPathTemplate": "/api/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 5008
        }
      ],
      "UpstreamPathTemplate": "/content-api/{everything}",
      "UpstreamHttpMethod": [ "GET", "POST", "PUT", "DELETE" ]
    },

    // Lessons Service (Port 5009)
    {
      "DownstreamPathTemplate": "/api/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 5009
        }
      ],
      "UpstreamPathTemplate": "/lessons-api/{everything}",
      "UpstreamHttpMethod": [ "GET", "POST", "PUT", "DELETE" ]
    }
  ]
}
```

## Frontend API Configuration

Update `frontend/zerquiz-web/src/config/api.ts`:

```typescript
export const API_ENDPOINTS = {
  // Existing services
  core: 'http://localhost:5001/api',
  identity: 'http://localhost:5002/api',
  curriculum: 'http://localhost:5003/api',
  questions: 'http://localhost:5004/api',
  exams: 'http://localhost:5005/api',
  grading: 'http://localhost:5006/api',
  
  // New AI-powered services
  content: 'http://localhost:5008/api',
  lessons: 'http://localhost:5009/api',
};
```

## Service Ports Summary

| Service | Port | Purpose |
|---------|------|---------|
| Core | 5001 | Tenants, Users, Definitions |
| Identity | 5002 | Authentication, Authorization |
| Curriculum | 5003 | Subjects, Topics, Standards |
| Questions | 5004 | Question Bank, Types |
| Exams | 5005 | Exam Management |
| Grading | 5006 | Scoring, Analytics |
| Finance | 5007 | Billing, Subscriptions |
| **Content** | **5008** | **PDF Upload, AI Generation** |
| **Lessons** | **5009** | **Lesson Plans, Assignments** |




