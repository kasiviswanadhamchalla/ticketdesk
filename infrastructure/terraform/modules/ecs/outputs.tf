output "cluster_name" {
  description = "The name of the ECS Cluster"
  value       = aws_ecs_cluster.main.name
}

output "cluster_arn" {
  description = "The ARN of the ECS Cluster"
  value       = aws_ecs_cluster.main.arn
}

output "cluster_id" {
  description = "The ID of the ECS Cluster"
  value       = aws_ecs_cluster.main.id
}

output "service_name" {
  description = "The name of the ECS Service"
  value       = aws_ecs_service.backend.name
}

output "service_id" {
  description = "The ID of the ECS Service"
  value       = aws_ecs_service.backend.id
}

output "task_definition_arn" {
  description = "The ARN of the ECS Task Definition"
  value       = aws_ecs_task_definition.backend.arn
}

output "log_group_name" {
  description = "The name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.ecs.name
}
