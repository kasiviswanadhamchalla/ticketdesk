output "alb_id" {
  description = "The ID of the ALB"
  value       = aws_lb.main.id
}

output "alb_arn" {
  description = "The ARN of the ALB"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "The public DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "The canonical hosted zone ID of the ALB"
  value       = aws_lb.main.zone_id
}

output "target_group_arn" {
  description = "The ARN of the ECS backend Target Group"
  value       = aws_lb_target_group.backend.arn
}

output "target_group_name" {
  description = "The name of the ECS backend Target Group"
  value       = aws_lb_target_group.backend.name
}

output "listener_arn" {
  description = "The ARN of the HTTP listener"
  value       = aws_lb_listener.http.arn
}
