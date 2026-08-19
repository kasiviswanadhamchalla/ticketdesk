variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "owner" {
  description = "Resource owner identifier"
  type        = string
  default     = "ks"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for ALB target group"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs to host ALB"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID attached to ALB"
  type        = string
}

variable "health_check_path" {
  description = "HTTP health check endpoint path"
  type        = string
  default     = "/actuator/health"
}

variable "container_port" {
  description = "Port exposed by the backend container"
  type        = number
  default     = 8080
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
