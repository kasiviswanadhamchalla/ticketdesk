# TicketDesk Troubleshooting Guide

Comprehensive guide for diagnosing and resolving infrastructure, application, and database issues.

---

## Troubleshooting Decision Matrix

### 1. Spring Boot Fargate Container Fails Health Check (502 Bad Gateway / Unhealthy Target)
- **Symptom**: ALB target group reports `UnhealthyHostCount > 0`.
- **Root Causes**:
  - Flyway migration SQL error during startup.
  - Database credentials mismatch between Secrets Manager and RDS.
  - Java Heap OutOfMemory (`java.lang.OutOfMemoryError`).
- **Diagnosis**:
  ```bash
  aws ecs list-tasks --cluster ticketdesk-prod-cluster --region us-east-1
  aws ecs describe-tasks --cluster ticketdesk-prod-cluster --tasks <TASK_ARN> --region us-east-1
  aws logs tail /ecs/ticketdesk-prod --since 1h --region us-east-1
  ```
- **Resolution**:
  - Verify DB password secret in AWS Secrets Manager: `ticketdesk/prod/db_password`.
  - Fix any syntax errors in `backend/src/main/resources/db/migration/`.

---

### 2. CORS Errors on S3 Pre-Signed Attachment Upload
- **Symptom**: Browser console error: `Access to XMLHttpRequest at 's3.amazonaws.com...' from origin 'http://localhost' has been blocked by CORS policy`.
- **Root Cause**: S3 Bucket CORS rules missing `PUT` method or origin.
- **Resolution**:
  - Verify S3 bucket CORS configuration in Terraform:
    ```hcl
    cors_rule {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
      allowed_origins = ["*"]
    }
    ```

---

### 3. JWT Token Authentication Failure (401 Unauthorized)
- **Symptom**: API calls return `401 Unauthorized` with `JWT token is expired` or `Invalid signature`.
- **Root Cause**: Clock drift between server and client or expired refresh token.
- **Resolution**:
  - User should log in again to receive a fresh access/refresh token pair.
  - Ensure system clocks are synchronized via NTP.
