output "db_instance_id" {
  description = "The RDS instance identifier"
  value       = aws_db_instance.mysql.id
}

output "db_instance_address" {
  description = "The hostname endpoint of the RDS instance"
  value       = aws_db_instance.mysql.address
}

output "db_instance_endpoint" {
  description = "The connection endpoint (host:port) of the RDS instance"
  value       = aws_db_instance.mysql.endpoint
}

output "db_name" {
  description = "The database name"
  value       = aws_db_instance.mysql.db_name
}
