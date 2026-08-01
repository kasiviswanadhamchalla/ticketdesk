# TicketDesk Operational Runbook

Operational procedures, monitoring guidelines, maintenance tasks, and emergency recovery instructions for TicketDesk engineers.

---

## 1. Daily Operations & Health Monitoring

### Service Health Checks
- **Application Load Balancer Health Endpoint**: `http://<ALB_DNS>/api/actuator/health`
- **CloudWatch Dashboard**: Access AWS Console -> CloudWatch -> Dashboards -> `ticketdesk-prod-dashboard`.

### CloudWatch Log Inspection
To view real-time logs from ECS Fargate containers:
```bash
aws logs tail /ecs/ticketdesk-prod --follow --region us-east-1
```

---

## 2. Scaling Procedures

### Manual ECS Task Scaling
If traffic spikes occur:
```bash
aws ecs update-service \
  --cluster ticketdesk-prod-cluster \
  --service ticketdesk-prod-backend-service \
  --desired-count 4 \
  --region us-east-1
```

### Auto-Scaling Rules
Auto-scaling is configured via Terraform (`aws_appautoscaling_policy`) to scale tasks between **1 and 4** based on a target CPU utilization of **75%**.

---

## 3. Database Backup & Recovery

### On-Demand Snapshot
```bash
aws rds create-db-snapshot \
  --db-instance-identifier ticketdesk-prod-postgres \
  --db-snapshot-identifier ticketdesk-backup-$(date +%Y%m%d%H%M) \
  --region us-east-1
```

### Database Restore
To restore database state from a snapshot:
```bash
aws rds restore-db-instance-from-db-snapshot \
  --target-db-instance-identifier ticketdesk-prod-postgres-restored \
  --db-snapshot-identifier <SNAPSHOT_ID> \
  --db-instance-class db.t4g.micro \
  --no-publicly-accessible
```

---

## 4. Emergency Incident Management

| Incident | Root Cause | Action |
| :--- | :--- | :--- |
| **High 5xx Errors** | Database connection pool exhaustion or crash | Restart ECS Service: `aws ecs update-service --force-new-deployment` |
| **Unhealthy Targets** | Spring Boot app health check failing | Inspect CloudWatch logs for OutOfMemory or Flyway migration errors |
| **High Memory (>90%)** | Java heap allocation threshold exceeded | Increase task memory in `infrastructure/terraform/modules/ecs/variables.tf` |
