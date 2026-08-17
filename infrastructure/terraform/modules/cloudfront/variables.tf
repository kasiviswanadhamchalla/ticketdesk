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

variable "frontend_bucket_id" {
  description = "ID of frontend S3 bucket"
  type        = string
}

variable "frontend_bucket_arn" {
  description = "ARN of frontend S3 bucket"
  type        = string
}

variable "frontend_bucket_domain_name" {
  description = "Regional domain name of frontend S3 bucket"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
