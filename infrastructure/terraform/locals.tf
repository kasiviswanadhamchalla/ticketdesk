locals {
  name_prefix = "tkt-${var.owner}-${var.environment}"

  common_tags = {
    Project     = "TicketDesk"
    Owner       = var.owner
    Environment = var.environment
    CostCenter  = var.cost_center
    ManagedBy   = "Terraform"
  }
}
