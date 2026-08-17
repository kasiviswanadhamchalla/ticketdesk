output "frontend_bucket_id" {
  description = "ID of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_bucket_arn" {
  description = "ARN of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend.arn
}

output "frontend_bucket_regional_domain_name" {
  description = "Regional domain name of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend.bucket_regional_domain_name
}

output "frontend_website_endpoint" {
  description = "Website endpoint URL for S3 static hosting"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "attachments_bucket_id" {
  description = "ID of the ticket attachments S3 bucket"
  value       = aws_s3_bucket.attachments.id
}

output "attachments_bucket_arn" {
  description = "ARN of the ticket attachments S3 bucket"
  value       = aws_s3_bucket.attachments.arn
}
