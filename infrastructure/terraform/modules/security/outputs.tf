output "alb_security_group_id" {
  description = "Security group ID for Application Load Balancer"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "Security group ID for ECS Fargate tasks"
  value       = aws_security_group.ecs_tasks.id
}

output "rds_security_group_id" {
  description = "Security group ID for RDS MySQL database"
  value       = aws_security_group.rds.id
}

output "ecs_execution_role_arn" {
  description = "IAM Role ARN for ECS Task Execution"
  value       = aws_iam_role.ecs_execution_role.arn
}

output "ecs_execution_role_name" {
  description = "IAM Role Name for ECS Task Execution"
  value       = aws_iam_role.ecs_execution_role.name
}

output "ecs_task_role_arn" {
  description = "IAM Role ARN for ECS Application Runtime Task"
  value       = aws_iam_role.ecs_task_role.arn
}

output "ecs_task_role_name" {
  description = "IAM Role Name for ECS Application Runtime Task"
  value       = aws_iam_role.ecs_task_role.name
}
