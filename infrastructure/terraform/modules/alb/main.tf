# Internet-facing Application Load Balancer
resource "aws_lb" "main" {
  name               = "tkt-${var.owner}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-alb"
  })
}

# Target Group for ECS Fargate Tasks (ip target type)
resource "aws_lb_target_group" "backend" {
  name        = "tkt-${var.owner}-${var.environment}-backend-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = var.health_check_path
    port                = "traffic-port"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-399"
  }

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-backend-tg"
  })
}

# HTTP Port 80 Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
