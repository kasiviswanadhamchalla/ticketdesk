# TicketDesk AWS Monthly Cost Estimation

Estimated monthly AWS infrastructure costs for running TicketDesk in `us-east-1` (US East N. Virginia) region.

---

## Cost Breakdown Table

| AWS Service | Configuration Specs | Quantity / Usage | Estimated Monthly Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Amazon ECS Fargate** | 0.5 vCPU, 1 GB RAM per task | 2 Tasks running 24/7 | ~$22.00 |
| **Amazon RDS PostgreSQL** | `db.t4g.micro` (2 vCPU, 1 GB RAM), 20 GB gp3 storage | 1 Single-AZ Instance | ~$15.50 |
| **Application Load Balancer** | 1 ALB, 0.5 LCU average traffic | 730 Hours / month | ~$20.00 |
| **Amazon CloudFront** | Global CDN for static frontend S3 | 50 GB Data Transfer Out | ~$4.25 |
| **Amazon S3** | Standard Storage for frontend site & ticket attachments | 10 GB Storage + Requests | ~$0.30 |
| **Amazon ECR** | Container Image Repositories | 5 GB Storage | ~$0.50 |
| **AWS Secrets Manager** | 2 Secret Keys (`db_password`, `jwt_secret`) | 2 Secrets | ~$0.80 |
| **Amazon CloudWatch** | Logs, Metrics, 1 Dashboard, 4 Alarms | ~3 GB Ingestion | ~$3.50 |
| **AWS NAT Gateway** | 1 NAT Gateway in Public Subnet 1 | 730 Hours + Data Processed | ~$32.00 |
| **Total Estimated Cost** | **Production Grade High-Availability Stack** | **Monthly Total** | **~$98.85 / month** |

---

## Cost Optimization Strategies

1. **Development / Sandbox Environment**:
   - Replace NAT Gateway with VPC Endpoints or single public subnet for non-prod environments to save ~$32/month.
2. **Compute Savings Plans**:
   - Save up to 20-30% on ECS Fargate compute costs by committing to a 1-year Fargate Savings Plan.
3. **S3 Lifecycle Policies**:
   - Transition old ticket attachments older than 90 days to S3 Standard-Infrequent Access (Standard-IA) or Glacier.
