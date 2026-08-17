variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "owner" {
  description = "Resource owner identifier (e.g. kc)"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (must be 2 CIDRs in different AZs)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (must be 2 CIDRs in different AZs)"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "enable_nat_gateway" {
  description = "Flag to enable NAT Gateway creation for private subnets"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Flag to deploy a single NAT Gateway shared across private subnets (cost conscious for dev)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
