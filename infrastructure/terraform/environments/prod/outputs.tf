output "alb_dns_name" {
  description = "Application Load Balancer Endpoint URL"
  value       = module.alb.alb_dns_name
}

output "cloudfront_domain_name" {
  description = "CloudFront Web Application Distribution URL"
  value       = module.cloudfront.distribution_domain_name
}

output "backend_ecr_repository_url" {
  description = "Amazon ECR Backend Repository URL"
  value       = module.ecr.repository_url
}

output "frontend_ecr_repository_url" {
  description = "Amazon ECR Frontend Repository URL"
  value       = module.ecr.repository_url
}

output "rds_endpoint" {
  description = "Amazon RDS PostgreSQL Private Endpoint"
  value       = module.rds.db_instance_endpoint
}

output "s3_attachment_bucket" {
  description = "Amazon S3 Ticket Attachments Bucket"
  value       = module.s3.attachments_bucket_id
}
