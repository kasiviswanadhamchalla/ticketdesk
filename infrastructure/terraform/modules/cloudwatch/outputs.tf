output "dashboard_name" {
  description = "Name of the CloudWatch monitoring dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "ecs_cpu_alarm_arn" {
  description = "ARN of the ECS High CPU alarm"
  value       = aws_cloudwatch_metric_alarm.ecs_high_cpu.arn
}
