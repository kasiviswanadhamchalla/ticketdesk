# -----------------------------------------------------------------------------
# Core Infrastructure Configuration Variables
# -----------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS region for infrastructure deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project used in naming conventions"
  type        = string
  default     = "tkt"
}

variable "owner" {
  description = "Owner/team identifier for resource tagging and naming (e.g. kc)"
  type        = string
  default     = "kc"
}

variable "environment" {
  description = "Deployment environment name (e.g. dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod", "test"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod, test."
  }
}

variable "cost_center" {
  description = "Cost center tracking identifier"
  type        = string
  default     = "CC-1234"
}

# -----------------------------------------------------------------------------
# Feature Toggles (Milestones M3 - M7)
# -----------------------------------------------------------------------------

variable "enable_rds" {
  description = "Enable RDS MySQL database instance creation (M3)"
  type        = bool
  default     = true
}

variable "enable_secrets" {
  description = "Enable AWS Secrets Manager & SSM Parameter Store (M3)"
  type        = bool
  default     = true
}

variable "enable_s3" {
  description = "Enable S3 Frontend & Ticket Attachments buckets (M4/M5)"
  type        = bool
  default     = true
}

variable "enable_cloudfront" {
  description = "Enable CloudFront CDN distribution for static frontend (M4)"
  type        = bool
  default     = true
}

variable "enable_lambda" {
  description = "Enable S3 event-driven Lambda thumbnail processor (M5)"
  type        = bool
  default     = true
}

variable "enable_cloudwatch_dashboard" {
  description = "Enable CloudWatch dashboards & alarms (M7)"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Networking Variables
# -----------------------------------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block for primary VPC"
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "vpc_cidr must be a valid IPv4 CIDR block."
  }
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (spanning 2 AZs)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (spanning 2 AZs)"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnet outbound internet access"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Deploy a single shared NAT Gateway for cost-conscious development"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# ECS & Application Variables
# -----------------------------------------------------------------------------

variable "container_image" {
  description = "Full ECR container image URI with tag (e.g. 559971704569.dkr.ecr.us-east-1.amazonaws.com/tkt-ks-backend:v1)"
  type        = string
  default     = "559971704569.dkr.ecr.us-east-1.amazonaws.com/tkt-ks-backend:v1"
}

variable "container_port" {
  description = "Container exposure port for TicketDesk Spring Boot API"
  type        = number
  default     = 8080
}

variable "desired_count" {
  description = "Desired count of running ECS Fargate task instances"
  type        = number
  default     = 1
}

variable "cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU, 512 = 0.5 vCPU, 1024 = 1 vCPU)"
  type        = number
  default     = 512

  validation {
    condition     = contains([256, 512, 1024, 2048, 4096], var.cpu)
    error_message = "CPU units must be a valid Fargate value: 256, 512, 1024, 2048, or 4096."
  }
}

variable "memory" {
  description = "Fargate task Memory in MiB (512, 1024, 2048, 4096, etc.)"
  type        = number
  default     = 1024
}

variable "log_retention_days" {
  description = "CloudWatch log group retention period in days"
  type        = number
  default     = 7
}

variable "health_check_path" {
  description = "ALB target group health check HTTP endpoint path"
  type        = string
  default     = "/api/actuator/health"
}
