# TicketDesk Database Schema (MySQL 8.0)

This document describes the relational database schema managed by **Flyway SQL Migrations** on **MySQL 8.0** / **Amazon RDS MySQL**.

---

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has"
    USERS ||--o{ REFRESH_TOKENS : "owns"
    USERS ||--o{ TICKETS : "creates (createdBy)"
    USERS ||--o{ TICKETS : "assigned (assignedTo)"
    CATEGORIES ||--o{ TICKETS : "categorizes"
    PRIORITIES ||--o{ TICKETS : "prioritizes"
    TICKETS ||--o{ COMMENTS : "contains"
    USERS ||--o{ COMMENTS : "authors"
    TICKETS ||--o{ ATTACHMENTS : "attaches"
    USERS ||--o{ ATTACHMENTS : "uploads"
    USERS ||--o{ NOTIFICATIONS : "receives"

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        bigint role_id FK
        boolean is_active
        timestamp created_at
    }

    TICKETS {
        bigint id PK
        varchar ticket_number UK
        varchar title
        text description
        varchar status
        bigint priority_id FK
        bigint category_id FK
        bigint created_by_id FK
        bigint assigned_to_id FK
        timestamp created_at
        timestamp resolved_at
        timestamp closed_at
    }

    COMMENTS {
        bigint id PK
        bigint ticket_id FK
        bigint user_id FK
        text content
        boolean is_internal
        timestamp created_at
    }

    ATTACHMENTS {
        bigint id PK
        bigint ticket_id FK
        varchar file_name
        varchar file_key UK
        bigint file_size
        varchar file_type
        bigint uploaded_by_id FK
        timestamp created_at
    }
```

---

## 2. Table Field Specifications

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique User ID |
| `username` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Login username |
| `email` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | User email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | BCrypt password hash |
| `role_id` | `BIGINT` | `REFERENCES roles(id)` | User Role FK |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Account status flag |

### `tickets`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique Ticket ID |
| `ticket_number` | `VARCHAR(20)` | `NOT NULL, UNIQUE` | Formatted number e.g. `TICK-1001` |
| `title` | `VARCHAR(200)` | `NOT NULL` | Ticket subject |
| `description` | `TEXT` | `NOT NULL` | Detailed problem description |
| `status` | `VARCHAR(30)` | `NOT NULL` | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED` |
| `priority_id` | `BIGINT` | `REFERENCES priorities(id)` | Priority FK |
| `category_id` | `BIGINT` | `REFERENCES categories(id)` | Category FK |
| `created_by_id` | `BIGINT` | `REFERENCES users(id)` | Creator User FK |
| `assigned_to_id` | `BIGINT` | `REFERENCES users(id)` | Assigned Engineer User FK |
