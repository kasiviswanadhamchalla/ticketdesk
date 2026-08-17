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

variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "container_port" {
  description = "Application container port to allow inbound traffic from ALB"
  type        = number
  default     = 8080
}

variable "enable_s3" {
  description = "Flag indicating if S3 attachment access policy should be attached"
  type        = bool
  default     = true
}

variable "attachment_bucket_arn" {
  description = "ARN of S3 bucket for ticket attachments (M5 preparation)"
  type        = string
  default     = "*"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
