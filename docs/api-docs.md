# TicketDesk REST API Reference

All API requests must include the header `Authorization: Bearer <JWT_ACCESS_TOKEN>` except public authentication endpoints.

Base URL: `/api`

---

## Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | User login with username/email & password | No |
| `POST` | `/auth/register` | Register new employee account | No |
| `POST` | `/auth/refresh-token` | Exchange valid refresh token for new access token | No |
| `POST` | `/auth/change-password` | Change current user password | Yes |
| `POST` | `/auth/forgot-password` | Initiate password reset | No |
| `POST` | `/auth/logout` | Revoke refresh token and sign out | Yes |

---

## Ticket Operations (`/api/tickets`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/tickets` | Create a new ticket | Yes |
| `GET` | `/tickets` | List tickets with search, filtering, and pagination | Yes |
| `GET` | `/tickets/{id}` | Get ticket details by ID | Yes |
| `GET` | `/tickets/number/{ticketNumber}` | Get ticket by unique ticket number (`TICK-XXXX`) | Yes |
| `PUT` | `/tickets/{id}` | Update ticket details | Yes |
| `PATCH` | `/tickets/{id}/status` | Update ticket status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED`) | Yes |
| `PATCH` | `/tickets/{id}/assign` | Assign ticket to support engineer | Admin / Support |
| `DELETE` | `/tickets/{id}` | Delete ticket | Admin Only |

---

## Attachment Endpoints (`/api/attachments`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/attachments/presigned-url` | Generate S3 pre-signed upload URL | Yes |
| `POST` | `/attachments/confirm` | Confirm S3 file upload & persist metadata | Yes |
| `GET` | `/attachments/ticket/{ticketId}` | List attachments for ticket | Yes |
| `GET` | `/attachments/{id}/download-url` | Generate S3 pre-signed download URL | Yes |
| `DELETE` | `/attachments/{id}` | Delete attachment | Yes |

---

## Interactive OpenAPI Documentation
When running locally or on AWS, access Swagger UI at:
`http://localhost:8080/api/swagger-ui/index.html` or `http://<ALB_DNS>/api/swagger-ui/index.html`
