# -----------------------------------------------------------------------------
# Module 1: Networking (VPC, Subnets, IGW, NAT Gateway, Route Tables)
# -----------------------------------------------------------------------------
module "networking" {
  source = "./modules/networking"

  project_name         = var.project_name
  owner                = var.owner
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  enable_nat_gateway   = var.enable_nat_gateway
  single_nat_gateway   = var.single_nat_gateway
  tags                 = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 2: Security (ALB, ECS & RDS Security Groups, IAM Task Roles)
# -----------------------------------------------------------------------------
module "security" {
  source = "./modules/security"

  project_name          = var.project_name
  owner                 = var.owner
  environment           = var.environment
  vpc_id                = module.networking.vpc_id
  container_port        = var.container_port
  enable_s3             = var.enable_s3
  attachment_bucket_arn = var.enable_s3 ? module.s3[0].attachments_bucket_arn : "*"
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 3: Application Load Balancer (ALB, Target Group, HTTP Listener)
# -----------------------------------------------------------------------------
module "alb" {
  source = "./modules/alb"

  project_name          = var.project_name
  owner                 = var.owner
  environment           = var.environment
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  health_check_path     = var.health_check_path
  container_port        = var.container_port
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 4: Amazon ECR (Backend Image Repository, Scanning & Lifecycle)
# -----------------------------------------------------------------------------
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  owner        = var.owner
  environment  = var.environment
  tags         = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 5: AWS Secrets Manager & Parameter Store (M3)
# -----------------------------------------------------------------------------
module "secrets" {
  count  = var.enable_secrets ? 1 : 0
  source = "./modules/secrets"

  project_name = var.project_name
  owner        = var.owner
  environment  = var.environment
  aws_region   = var.aws_region
  db_host      = var.enable_rds ? module.rds[0].db_instance_address : "localhost"
  db_name      = "ticketdesk"
  db_port      = 3306
  tags         = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 6: Amazon RDS MySQL Database (M3)
# -----------------------------------------------------------------------------
module "rds" {
  count  = var.enable_rds ? 1 : 0
  source = "./modules/rds"

  project_name          = var.project_name
  owner                 = var.owner
  environment           = var.environment
  private_subnet_ids     = module.networking.private_subnet_ids
  rds_security_group_id = module.security.rds_security_group_id
  db_name               = "ticketdesk"
  db_username           = "dbadmin"
  db_password           = var.enable_secrets ? module.secrets[0].db_password_plain : "FallbackSecretPassword123!"
  db_instance_class     = "db.t3.micro"
  allocated_storage     = 20
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 7: Amazon ECS Fargate (Cluster, Log Group, Task Definition, Service)
# -----------------------------------------------------------------------------
module "ecs" {
  source = "./modules/ecs"

  project_name           = var.project_name
  owner                  = var.owner
  environment            = var.environment
  aws_region             = var.aws_region
  private_subnet_ids     = module.networking.private_subnet_ids
  ecs_security_group_id  = module.security.ecs_security_group_id
  target_group_arn       = module.alb.target_group_arn
  ecs_execution_role_arn = module.security.ecs_execution_role_arn
  ecs_task_role_arn      = module.security.ecs_task_role_arn
  container_image        = var.container_image
  db_host                = var.enable_rds ? module.rds[0].db_instance_address : "localhost"
  db_username            = "dbadmin"
  attachment_bucket_name = var.enable_s3 ? module.s3[0].attachments_bucket_id : ""
  db_password_secret_arn = var.enable_secrets ? module.secrets[0].db_password_secret_arn : ""
  jwt_secret_arn         = var.enable_secrets ? module.secrets[0].jwt_secret_arn : ""
  container_port         = var.container_port
  desired_count          = var.desired_count
  cpu                    = var.cpu
  memory                 = var.memory
  log_retention_days     = var.log_retention_days
  tags                   = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 8: Amazon S3 (Frontend & Attachments Buckets) (M4/M5)
# -----------------------------------------------------------------------------
module "s3" {
  count  = var.enable_s3 ? 1 : 0
  source = "./modules/s3"

  project_name = var.project_name
  owner        = var.owner
  environment  = var.environment
  tags         = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 9: Amazon CloudFront CDN Distribution (M4)
# -----------------------------------------------------------------------------
module "cloudfront" {
  count  = var.enable_s3 && var.enable_cloudfront ? 1 : 0
  source = "./modules/cloudfront"

  project_name                 = var.project_name
  owner                        = var.owner
  environment                  = var.environment
  frontend_bucket_id           = module.s3[0].frontend_bucket_id
  frontend_bucket_arn          = module.s3[0].frontend_bucket_arn
  frontend_bucket_domain_name = module.s3[0].frontend_bucket_regional_domain_name
  tags                         = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 10: AWS Lambda Thumbnail Processor (M5)
# -----------------------------------------------------------------------------
module "lambda" {
  count  = var.enable_s3 && var.enable_lambda ? 1 : 0
  source = "./modules/lambda"

  project_name           = var.project_name
  owner                  = var.owner
  environment            = var.environment
  attachments_bucket_id  = module.s3[0].attachments_bucket_id
  attachments_bucket_arn = module.s3[0].attachments_bucket_arn
  tags                   = local.common_tags
}

# -----------------------------------------------------------------------------
# Module 11: Amazon CloudWatch Dashboard & Alarms (M7)
# -----------------------------------------------------------------------------
module "cloudwatch" {
  count  = var.enable_cloudwatch_dashboard ? 1 : 0
  source = "./modules/cloudwatch"

  project_name            = var.project_name
  owner                   = var.owner
  environment             = var.environment
  ecs_cluster_name        = module.ecs.cluster_name
  ecs_service_name        = module.ecs.service_name
  enable_alb_alarms       = var.enable_cloudwatch_dashboard
  alb_arn_suffix          = module.alb.alb_arn
  target_group_arn_suffix = module.alb.target_group_arn
  tags                    = local.common_tags
}
