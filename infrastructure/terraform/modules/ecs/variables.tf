variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "owner" {
  description = "Resource owner identifier"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "aws_region" {
  description = "AWS Region for CloudWatch log stream"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS task deployment"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "target_group_arn" {
  description = "ALB target group ARN for container registration"
  type        = string
}

variable "ecs_execution_role_arn" {
  description = "IAM Role ARN for ECS Task Execution"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "IAM Role ARN for ECS Task Application Runtime"
  type        = string
}

variable "container_image" {
  description = "Full ECR Image URI with tag (e.g. 559971704569.dkr.ecr.us-east-1.amazonaws.com/tkt-ks-backend:v1)"
  type        = string
}

variable "db_host" {
  description = "RDS MySQL Host Address"
  type        = string
  default     = "localhost"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "dbadmin"
}

variable "attachment_bucket_name" {
  description = "Name of the ticket attachments S3 bucket"
  type        = string
  default     = ""
}

variable "db_password_secret_arn" {
  description = "Secrets Manager ARN for DB password"
  type        = string
  default     = ""
}

variable "jwt_secret_arn" {
  description = "Secrets Manager ARN for JWT secret"
  type        = string
  default     = ""
}

variable "container_port" {
  description = "Container port exposure"
  type        = number
  default     = 8080
}

variable "desired_count" {
  description = "Desired number of ECS task instances"
  type        = number
  default     = 1
}

variable "cpu" {
  description = "Fargate CPU units (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 512
}

variable "memory" {
  description = "Fargate Memory in MiB (512, 1024, 2048, etc.)"
  type        = number
  default     = 1024
}

variable "log_retention_days" {
  description = "CloudWatch Log retention in days"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
