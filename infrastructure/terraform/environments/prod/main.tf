terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }

  # Production S3 Backend Configuration (Uncomment for remote state)
  # backend "s3" {
  #   bucket         = "ticketdesk-terraform-state-prod"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "ticketdesk-terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "TicketDesk"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. VPC Module
module "vpc" {
  source                = "../../modules/vpc"
  project_name          = var.project_name
  environment           = var.environment
  aws_region            = var.aws_region
  vpc_cidr              = var.vpc_cidr
  public_subnet_1_cidr  = var.public_subnet_1_cidr
  public_subnet_2_cidr  = var.public_subnet_2_cidr
  private_subnet_1_cidr = var.private_subnet_1_cidr
  private_subnet_2_cidr = var.private_subnet_2_cidr
}

# 2. Security Groups Module
module "security_groups" {
  source       = "../../modules/security_groups"
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
}

# 3. Application Load Balancer Module
module "alb" {
  source                = "../../modules/alb"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  alb_security_group_id = module.security_groups.alb_sg_id
}

# 4. RDS PostgreSQL Module
module "rds" {
  source                = "../../modules/rds"
  project_name          = var.project_name
  environment           = var.environment
  private_subnet_ids    = module.vpc.private_subnet_ids
  rds_security_group_id = module.security_groups.rds_sg_id
  db_password           = var.db_password
}

# 5. ECR Repositories Module
module "ecr" {
  source       = "../../modules/ecr"
  project_name = var.project_name
}

# 6. S3 Storage Module
module "s3" {
  source       = "../../modules/s3"
  project_name = var.project_name
  environment  = var.environment
}

# 7. CloudFront CDN Module
module "cloudfront" {
  source                        = "../../modules/cloudfront"
  project_name                  = var.project_name
  environment                   = var.environment
  frontend_s3_website_endpoint = module.s3.frontend_bucket_website_endpoint
}

# 8. Secrets & Parameters Module
module "secrets" {
  source       = "../../modules/secrets"
  project_name = var.project_name
  environment  = var.environment
  db_password  = var.db_password
  jwt_secret   = var.jwt_secret
  db_endpoint  = module.rds.db_instance_endpoint
}

# 9. IAM Roles Module
module "iam" {
  source                = "../../modules/iam"
  project_name          = var.project_name
  environment           = var.environment
  attachment_bucket_arn = module.s3.attachment_bucket_arn
}

# 10. Lambda Function Module
module "lambda" {
  source       = "../../modules/lambda"
  project_name = var.project_name
  environment  = var.environment
}

# 11. CloudWatch Log Group & Dashboard Module
module "cloudwatch" {
  source                  = "../../modules/cloudwatch"
  project_name            = var.project_name
  environment             = var.environment
  aws_region              = var.aws_region
  ecs_cluster_name        = module.ecs.cluster_name
  ecs_service_name        = module.ecs.service_name
  alb_arn_suffix          = module.alb.alb_arn
  target_group_arn_suffix = module.alb.target_group_arn
}

# 12. ECS Fargate Cluster & Service Module
module "ecs" {
  source                       = "../../modules/ecs"
  project_name                 = var.project_name
  environment                  = var.environment
  aws_region                   = var.aws_region
  private_subnet_ids           = module.vpc.private_subnet_ids
  ecs_tasks_security_group_id = module.security_groups.ecs_tasks_sg_id
  target_group_arn             = module.alb.target_group_arn
  alb_listener_arn             = module.alb.listener_arn
  ecs_execution_role_arn       = module.iam.ecs_execution_role_arn
  ecs_task_role_arn            = module.iam.ecs_task_role_arn
  backend_image_url            = module.ecr.backend_repository_url
  db_endpoint                  = module.rds.db_instance_address
  db_name                      = module.rds.db_name
  db_username                  = "ticketdesk_admin"
  db_password_secret_arn       = module.secrets.db_password_secret_arn
  jwt_secret_arn               = module.secrets.jwt_secret_arn
  attachment_bucket_name       = module.s3.attachment_bucket_name
  log_group_name               = module.cloudwatch.log_group_name
}
