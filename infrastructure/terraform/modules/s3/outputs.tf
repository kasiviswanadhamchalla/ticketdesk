output "attachment_bucket_name" {
  value = aws_s3_bucket.attachments.bucket
}

output "attachment_bucket_arn" {
  value = aws_s3_bucket.attachments.arn
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "frontend_bucket_website_endpoint" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
