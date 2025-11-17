# API Documentation

## Overview

Metzler Foundations provides a RESTful API for managing applications, beneficiaries, partners, and resources. All API endpoints require authentication and follow HIPAA compliance standards.

## Authentication

### Bearer Token Authentication

```http
Authorization: Bearer <token>
```

### Session-based Authentication

For web clients, authentication is handled via Supabase sessions.

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Application submissions**: 5 per day per IP

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
```

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Error Codes

| Code                   | Description              | HTTP Status |
| ---------------------- | ------------------------ | ----------- |
| `VALIDATION_ERROR`     | Input validation failed  | 400         |
| `AUTHENTICATION_ERROR` | Invalid credentials      | 401         |
| `AUTHORIZATION_ERROR`  | Insufficient permissions | 403         |
| `NOT_FOUND`            | Resource not found       | 404         |
| `RATE_LIMITED`         | Too many requests        | 429         |
| `SERVER_ERROR`         | Internal server error    | 500         |

## Applications API

### Create Application

```http
POST /api/applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "beneficiaryId": "uuid",
  "amountRequested": 500,
  "specialRequirements": "Wheelchair accessible housing needed",
  "preferredStartDate": "2025-01-15"
}
```

**Response:**

```json
{
  "id": "uuid",
  "status": "pending",
  "amountRequested": 500,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Get Applications

```http
GET /api/applications?status=pending&limit=10&offset=0
Authorization: Bearer <token>
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "status": "pending",
      "amountRequested": 500,
      "beneficiary": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

### Update Application

```http
PUT /api/applications/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "approved",
  "amountApproved": 500,
  "notes": "Application approved for immediate housing assistance"
}
```

### Submit Application

```http
POST /api/applications/{id}/submit
Authorization: Bearer <token>
```

Submits the application for review and sends confirmation emails.

## Beneficiaries API

### Create Beneficiary

```http
POST /api/beneficiaries
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "address": {
    "street": "123 Main St",
    "city": "Denver",
    "state": "CO",
    "zipCode": "80202"
  }
}
```

**Security Note:** SSN is encrypted at rest and never returned in API responses.

### Update Beneficiary

```http
PUT /api/beneficiaries/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "phone": "+1-555-0124",
  "address": {
    "street": "456 Oak Ave",
    "city": "Denver",
    "state": "CO",
    "zipCode": "80203"
  }
}
```

## Partners API

### List Partners

```http
GET /api/partners?city=Denver&verified=true
```

### Create Partner

```http
POST /api/partners
Content-Type: application/json
Authorization: Bearer <token>

{
  "organizationName": "Denver Recovery Center",
  "contactName": "Jane Smith",
  "contactEmail": "jane@denverrecovery.org",
  "contactPhone": "+1-555-0199",
  "address": {
    "street": "789 Recovery Way",
    "city": "Denver",
    "state": "CO",
    "zipCode": "80204"
  },
  "facilityType": "sober_living",
  "capacity": 20,
  "verified": false
}
```

## Resources API

### Search Resources

```http
GET /api/resources/search?q=rehab&city=Denver&type=treatment&limit=10
```

### Get Resource Details

```http
GET /api/resources/{id}
```

### Create Resource

```http
POST /api/resources
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Denver Detox Center",
  "description": "Medical detox services in downtown Denver",
  "category": "treatment",
  "city": "Denver",
  "state": "CO",
  "contactInfo": {
    "phone": "+1-555-0133",
    "email": "info@denverdetox.org"
  },
  "website": "https://denverdetox.org",
  "verified": true
}
```

## Analytics API

### Get Dashboard Metrics

```http
GET /api/analytics/dashboard?period=30d
Authorization: Bearer <token>
```

**Response:**

```json
{
  "applications": {
    "total": 156,
    "pending": 23,
    "approved": 89,
    "funded": 67
  },
  "beneficiaries": {
    "total": 247,
    "housed": 189,
    "active": 58
  },
  "funding": {
    "totalDisbursed": 74100,
    "averageAmount": 1106,
    "monthlyTrend": [8500, 9200, 7800]
  },
  "performance": {
    "approvalRate": 57,
    "averageProcessingTime": "2.3 days",
    "successRate": 76
  }
}
```

### Track Event

```http
POST /api/analytics/events
Content-Type: application/json

{
  "event": "application_started",
  "properties": {
    "source": "homepage",
    "userType": "beneficiary"
  },
  "userId": "uuid"
}
```

## Webhooks

### Application Status Updates

```http
POST /api/webhooks/application-status
X-Signature: <signature>
Content-Type: application/json

{
  "applicationId": "uuid",
  "oldStatus": "pending",
  "newStatus": "approved",
  "timestamp": "2025-01-01T12:00:00Z",
  "metadata": {
    "approvedBy": "uuid",
    "amountApproved": 500
  }
}
```

### Payment Events

```http
POST /api/webhooks/payment-events
X-Signature: <signature>
Content-Type: application/json

{
  "type": "payment.succeeded",
  "data": {
    "applicationId": "uuid",
    "amount": 500,
    "paymentMethod": "bank_transfer",
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

## SDKs and Libraries

### JavaScript SDK

```javascript
import { MetzlerAPI } from '@metzler/api-sdk'

const api = new MetzlerAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.metzlerfoundations.org'
})

// Create an application
const application = await api.applications.create({
  beneficiaryId: 'uuid',
  amountRequested: 500
})

// Get dashboard metrics
const metrics = await api.analytics.dashboard()
```

### Mobile SDKs

Coming soon for iOS and Android platforms.

## Rate Limits

| Endpoint             | Limit     | Window   |
| -------------------- | --------- | -------- |
| `/api/applications`  | 1000/hour | Per user |
| `/api/beneficiaries` | 500/hour  | Per user |
| `/api/partners`      | 500/hour  | Per user |
| `/api/resources`     | 2000/hour | Per IP   |
| `/api/analytics`     | 100/hour  | Per user |

## Versioning

API versioning follows semantic versioning:

- **v1** (current): `https://api.metzlerfoundations.org/v1/`
- Breaking changes will introduce new major versions
- Deprecation notices provided 6 months in advance

## Support

- **API Status**: [status.metzlerfoundations.org](https://status.metzlerfoundations.org)
- **Developer Portal**: [developers.metzlerfoundations.org](https://developers.metzlerfoundations.org)
- **Support**: [support@metzlerfoundations.org](mailto:support@metzlerfoundations.org)

## Changelog

### v1.0.0 (Current)

- Initial API release
- Core CRUD operations for all resources
- Authentication and authorization
- Rate limiting and security features
- Analytics and webhook support
