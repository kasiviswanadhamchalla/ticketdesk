# CloudWatch Dashboard for TicketDesk Monitoring
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "tkt-${var.owner}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", var.ecs_service_name, "ClusterName", var.ecs_cluster_name],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "ECS Fargate CPU & Memory Utilization (%)"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", var.alb_arn_suffix],
            [".", "HTTPCode_Target_2XX_Count", ".", "."]
          ]
          period = 300
          stat   = "Sum"
          region = "us-east-1"
          title  = "ALB HTTP Response Codes (2xx vs 5xx)"
        }
      }
    ]
  })
}

# Alarm 1: High ECS CPU Utilization (> 80%)
resource "aws_cloudwatch_metric_alarm" "ecs_high_cpu" {
  alarm_name          = "tkt-${var.owner}-${var.environment}-ecs-high-cpu"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggers when ECS service average CPU exceeds 80%"

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.ecs_service_name
  }

  tags = var.tags
}

# Alarm 2: High ECS Memory Utilization (> 80%)
resource "aws_cloudwatch_metric_alarm" "ecs_high_memory" {
  alarm_name          = "tkt-${var.owner}-${var.environment}-ecs-high-memory"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggers when ECS service average Memory exceeds 80%"

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.ecs_service_name
  }

  tags = var.tags
}

# Alarm 3: Unhealthy ALB Target Count (> 0)
resource "aws_cloudwatch_metric_alarm" "unhealthy_targets" {
  count               = var.enable_alb_alarms ? 1 : 0
  alarm_name          = "tkt-${var.owner}-${var.environment}-unhealthy-targets"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "UnhealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "Triggers when ALB target group has 1 or more unhealthy hosts"

  dimensions = {
    TargetGroup  = var.target_group_arn_suffix
    LoadBalancer = var.alb_arn_suffix
  }

  tags = var.tags
}
