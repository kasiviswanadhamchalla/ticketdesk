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

variable "db_host" {
  description = "RDS Database host endpoint"
  type        = string
  default     = "localhost"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "ticketdesk"
}

variable "db_port" {
  description = "Database port"
  type        = number
  default     = 3306
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
