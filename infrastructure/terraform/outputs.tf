# -----------------------------------------------------------------------------
# VPC & Networking Outputs
# -----------------------------------------------------------------------------

output "vpc_id" {
  description = "The ID of the primary VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "nat_gateway_ips" {
  description = "Public Elastic IP addresses assigned to NAT Gateways"
  value       = module.networking.nat_gateway_ips
}

# -----------------------------------------------------------------------------
# Security Group Outputs
# -----------------------------------------------------------------------------

output "alb_security_group_id" {
  description = "Security Group ID attached to ALB"
  value       = module.security.alb_security_group_id
}

output "ecs_security_group_id" {
  description = "Security Group ID attached to ECS Fargate tasks"
  value       = module.security.ecs_security_group_id
}

output "rds_security_group_id" {
  description = "Security Group ID reserved for RDS database"
  value       = module.security.rds_security_group_id
}

# -----------------------------------------------------------------------------
# Application Load Balancer Outputs
# -----------------------------------------------------------------------------

output "alb_dns_name" {
  description = "Public DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.alb.alb_arn
}

# -----------------------------------------------------------------------------
# ECR & ECS Outputs
# -----------------------------------------------------------------------------

output "ecr_repository_url" {
  description = "URL of the Amazon ECR backend repository"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the Amazon ECS Fargate Cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "Name of the Amazon ECS Fargate Service"
  value       = module.ecs.service_name
}

# -----------------------------------------------------------------------------
# RDS & Secrets Outputs (M3)
# -----------------------------------------------------------------------------

output "rds_endpoint" {
  description = "RDS MySQL Database Endpoint"
  value       = var.enable_rds ? module.rds[0].db_instance_endpoint : "N/A"
}

output "db_password_secret_arn" {
  description = "Secrets Manager ARN for DB Password"
  value       = var.enable_secrets ? module.secrets[0].db_password_secret_arn : "N/A"
}

# -----------------------------------------------------------------------------
# S3 & CloudFront Outputs (M4/M5)
# -----------------------------------------------------------------------------

output "s3_frontend_bucket" {
  description = "Frontend Static S3 Bucket Name"
  value       = var.enable_s3 ? module.s3[0].frontend_bucket_id : "N/A"
}

output "s3_frontend_website_url" {
  description = "Public URL for S3 Static Website Hosting"
  value       = var.enable_s3 ? "http://${module.s3[0].frontend_website_endpoint}" : "N/A"
}

output "s3_attachments_bucket" {
  description = "Ticket Attachments S3 Bucket Name"
  value       = var.enable_s3 ? module.s3[0].attachments_bucket_id : "N/A"
}

output "cloudfront_domain_name" {
  description = "Domain name of CloudFront CDN distribution"
  value       = var.enable_s3 && var.enable_cloudfront ? module.cloudfront[0].distribution_domain_name : "N/A"
}

# -----------------------------------------------------------------------------
# Lambda & CloudWatch Outputs (M5/M7)
# -----------------------------------------------------------------------------

output "lambda_thumbnail_function" {
  description = "Name of the S3 thumbnail processor Lambda function"
  value       = var.enable_s3 && var.enable_lambda ? module.lambda[0].function_name : "N/A"
}

output "cloudwatch_dashboard_name" {
  description = "Name of CloudWatch Monitoring Dashboard"
  value       = var.enable_cloudwatch_dashboard ? module.cloudwatch[0].dashboard_name : "N/A"
}
