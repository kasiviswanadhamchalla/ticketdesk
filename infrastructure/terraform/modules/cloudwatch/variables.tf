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

variable "ecs_cluster_name" {
  description = "ECS cluster name for metrics"
  type        = string
}

variable "ecs_service_name" {
  description = "ECS service name for metrics"
  type        = string
}

variable "enable_alb_alarms" {
  description = "Flag to enable ALB target group alarms"
  type        = bool
  default     = true
}

variable "alb_arn_suffix" {
  description = "ALB ARN suffix for metrics"
  type        = string
  default     = ""
}

variable "target_group_arn_suffix" {
  description = "ALB target group ARN suffix for metrics"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}

