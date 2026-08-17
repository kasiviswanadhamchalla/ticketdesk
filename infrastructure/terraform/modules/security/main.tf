# -----------------------------------------------------------------------------
# Security Groups
# -----------------------------------------------------------------------------

# 1. ALB Security Group (Public facing entry point)
resource "aws_security_group" "alb" {
  name        = "tkt-${var.owner}-${var.environment}-alb-sg"
  description = "Public security group for TicketDesk Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-alb-sg"
  })
}

# 2. ECS Tasks Security Group (Private application tier)
resource "aws_security_group" "ecs_tasks" {
  name        = "tkt-${var.owner}-${var.environment}-ecs-tasks-sg"
  description = "Private security group for ECS Fargate tasks (ingress restricted to ALB)"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow HTTP traffic on container port strictly from ALB SG"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow all outbound traffic (via NAT Gateway for ECR pulls and AWS APIs)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-ecs-tasks-sg"
  })
}

# 3. RDS MySQL Security Group (M3 Preparation - Database tier)
resource "aws_security_group" "rds" {
  name        = "tkt-${var.owner}-${var.environment}-rds-sg"
  description = "Private security group for RDS MySQL (ingress restricted to ECS Tasks SG)"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow MySQL 3306 strictly from ECS Tasks SG"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    description = "Allow outbound response traffic within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-rds-sg"
  })
}

# -----------------------------------------------------------------------------
# IAM Roles & Policies (Least-Privilege Enforcement)
# -----------------------------------------------------------------------------

# 1. ECS Task Execution Role (Used by AWS ECS Agent to pull images & push logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "tkt-${var.owner}-${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-ecs-execution-role"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_standard" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional execution permissions for Secrets Manager & Parameter Store in M3
resource "aws_iam_policy" "ecs_execution_ssm_secrets" {
  name        = "tkt-${var.owner}-${var.environment}-ecs-execution-secrets-policy"
  description = "Allows ECS Task Execution Role to read parameters and secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "secretsmanager:GetSecretValue"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_secrets_attach" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.ecs_execution_ssm_secrets.arn
}

# 2. ECS Task Role (Used by the Spring Boot Application Runtime)
resource "aws_iam_role" "ecs_task_role" {
  name = "tkt-${var.owner}-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-ecs-task-role"
  })
}

# Application Task Policy for S3 attachment access (M5 preparation)
resource "aws_iam_policy" "ecs_task_s3_policy" {
  count       = var.enable_s3 ? 1 : 0
  name        = "tkt-${var.owner}-${var.environment}-ecs-task-s3-policy"
  description = "Least privilege S3 access for TicketDesk Spring Boot application"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.attachment_bucket_arn,
          "${var.attachment_bucket_arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3_attach" {
  count      = var.enable_s3 ? 1 : 0
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_s3_policy[0].arn
}
