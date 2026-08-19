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

variable "private_subnet_ids" {
  description = "List of private subnet IDs for DB Subnet Group"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID for RDS MySQL"
  type        = string
}

variable "db_name" {
  description = "Name of initial database"
  type        = string
  default     = "ticketdesk"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS DB Instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
