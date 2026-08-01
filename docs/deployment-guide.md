# TicketDesk AWS Deployment Guide

This guide provides step-by-step instructions for deploying the **TicketDesk** application to AWS using Terraform and GitHub Actions.

---

## 1. Prerequisites

- **AWS Account** with Administrative Access
- **AWS CLI** configured (`aws configure`)
- **Terraform** >= 1.5.0 installed
- **Docker** & **Docker Compose** installed locally
- **GitHub Repository** access with repository secrets configured:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

---

## 2. Local Docker Deployment (Validation)

To run and validate the complete TicketDesk stack locally before cloud deployment:

```bash
# Clone the repository
git clone https://github.com/kasiviswanadhamchalla/ticketdesk.git
cd ticketdesk

# Build and start all services via Docker Compose
docker compose up --build -d

# Check service status & logs
docker compose ps
docker compose logs -f backend
```

- **Frontend URL**: http://localhost:80
- **Backend API**: http://localhost:8080/api
- **Health Endpoint**: http://localhost:8080/api/actuator/health

Default Login Credentials:
- **Admin**: `admin` / `Admin@123`
- **Support Engineer**: `support1` / `Admin@123`
- **Employee**: `employee1` / `Admin@123`

---

## 3. Terraform Cloud Infrastructure Provisioning

```bash
cd infrastructure/terraform/environments/prod

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Review execution plan
terraform plan

# Apply infrastructure creation
terraform apply -auto-approve
```

---

## 4. CI/CD Deployment via GitHub Actions

1. Commit and push your changes to `main` branch:
   ```bash
   git add .
   git commit -m "Deploy production updates"
   git push origin main
   ```
2. Monitor the automated GitHub Actions pipeline under the **Actions** tab.
3. The pipeline will automatically run security scans, unit tests, build Docker images, push to Amazon ECR, apply Terraform changes, update ECS Fargate services, and execute smoke tests.
