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

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
