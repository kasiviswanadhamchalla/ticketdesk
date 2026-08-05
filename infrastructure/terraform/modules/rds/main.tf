resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids  = var.private_subnet_ids
  description = "DB Subnet group for private RDS MySQL"

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  })
}

resource "aws_db_instance" "mysql" {
  identifier             = "${var.project_name}-${var.environment}-mysql"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = var.db_instance_class
  allocated_storage      = var.allocated_storage
  max_allocated_storage  = 100
  storage_type           = "gp3"
  storage_encrypted      = true
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false
  skip_final_snapshot    = true
  deletion_protection    = false
  parameter_group_name   = "default.mysql8.0"

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-mysql"
  })
}
