# Generate Random DB Password
resource "random_password" "db_password" {
  length  = 16
  special = false
}

# Generate Random JWT Secret
resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

# AWS Secrets Manager: DB Password
resource "aws_secretsmanager_secret" "db_password" {
  name                    = "tkt-${var.owner}-${var.environment}-db-password"
  recovery_window_in_days = 0

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-db-password"
  })
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

# AWS Secrets Manager: JWT Secret
resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "tkt-${var.owner}-${var.environment}-jwt-secret"
  recovery_window_in_days = 0

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-jwt-secret"
  })
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = random_password.jwt_secret.result
}

# SSM Parameter Store: DB Host
resource "aws_ssm_parameter" "db_host" {
  name        = "/tkt/${var.environment}/DB_HOST"
  description = "Database Host Endpoint"
  type        = "String"
  value       = var.db_host

  tags = var.tags
}

# SSM Parameter Store: DB Port
resource "aws_ssm_parameter" "db_port" {
  name        = "/tkt/${var.environment}/DB_PORT"
  description = "Database Connection Port"
  type        = "String"
  value       = tostring(var.db_port)

  tags = var.tags
}

# SSM Parameter Store: DB Name
resource "aws_ssm_parameter" "db_name" {
  name        = "/tkt/${var.environment}/DB_NAME"
  description = "Database Schema Name"
  type        = "String"
  value       = var.db_name

  tags = var.tags
}
