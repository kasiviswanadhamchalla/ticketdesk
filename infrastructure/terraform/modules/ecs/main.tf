# CloudWatch Log Group for ECS Tasks
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/tkt-${var.owner}-${var.environment}-backend"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "/ecs/tkt-${var.owner}-${var.environment}-backend"
  })
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "tkt-${var.owner}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-cluster"
  })
}

# ECS Fargate Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "tkt-${var.owner}-${var.environment}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.cpu)
  memory                   = tostring(var.memory)
  execution_role_arn       = var.ecs_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([
    {
      name      = "ticketdesk-backend"
      image     = var.container_image
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "PORT", value = tostring(var.container_port) },
        { name = "SPRING_PROFILES_ACTIVE", value = "prod" },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "DB_HOST", value = var.db_host },
        { name = "DB_PORT", value = "3306" },
        { name = "DB_NAME", value = "ticketdesk" },
        { name = "DB_USERNAME", value = var.db_username },
        { name = "AWS_S3_ATTACHMENT_BUCKET", value = var.attachment_bucket_name },
        { name = "AWS_S3_BUCKET", value = var.attachment_bucket_name },
        { name = "CORS_ALLOWED_ORIGINS", value = "*" }
      ]

      secrets = var.db_password_secret_arn != "" && var.jwt_secret_arn != "" ? [
        { name = "DB_PASSWORD", valueFrom = var.db_password_secret_arn },
        { name = "SPRING_DATASOURCE_PASSWORD", valueFrom = var.db_password_secret_arn },
        { name = "JWT_SECRET", valueFrom = var.jwt_secret_arn }
      ] : []

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-backend-td"
  })
}

# ECS Fargate Service
resource "aws_ecs_service" "backend" {
  name                               = "tkt-${var.owner}-${var.environment}-backend-service"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.backend.arn
  desired_count                      = var.desired_count
  launch_type                        = "FARGATE"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "ticketdesk-backend"
    container_port   = var.container_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-backend-service"
  })
}
