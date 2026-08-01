variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "frontend_s3_website_endpoint" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
