# CiviSight AI REST API

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Service health |
| POST | /auth/register | Citizen registration |
| POST | /auth/login | Login |
| POST | /issues/analyze | Analyze an image |
| POST | /issues | Create issue |
| GET | /issues | List/filter issues |
| GET | /issues/:id | Issue details |
| PATCH | /issues/:id | Update workflow |
| POST | /issues/:id/resolve | Resolve with optional image |
| GET | /analytics | Dashboard analytics |

### POST /issues/analyze
multipart/form-data:
- image
- description

### POST /issues
multipart/form-data:
- reporter_id
- image
- title
- description
- latitude
- longitude
- department

### PATCH /issues/:id
JSON:
```json
{
  "status": "In Progress",
  "assigned_to": "Road Team 17",
  "department": "Municipal Operations",
  "resolution_note": "Field team assigned."
}
```
