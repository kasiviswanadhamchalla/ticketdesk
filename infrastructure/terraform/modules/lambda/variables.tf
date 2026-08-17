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

variable "attachments_bucket_id" {
  description = "S3 bucket ID for ticket attachments"
  type        = string
}

variable "attachments_bucket_arn" {
  description = "S3 bucket ARN for ticket attachments"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
