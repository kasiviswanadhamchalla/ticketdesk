output "db_password_secret_arn" {
  description = "ARN of Secrets Manager DB password secret"
  value       = aws_secretsmanager_secret.db_password.arn
}

output "jwt_secret_arn" {
  description = "ARN of Secrets Manager JWT secret key"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "db_password_plain" {
  description = "Plaintext generated DB password (marked sensitive)"
  value       = random_password.db_password.result
  sensitive   = true
}

output "ssm_db_host_arn" {
  description = "ARN of SSM Parameter for DB host"
  value       = aws_ssm_parameter.db_host.arn
}
