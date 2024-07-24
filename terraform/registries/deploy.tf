resource "aws_ecr_repository" "frontend_deploy" {
  name                 = var.frontend_registry_name
  force_delete         = true
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecr_repository" "backend_deploy" {
  name                 = var.backend_registry_name
  force_delete         = true
  image_tag_mutability = "IMMUTABLE"
}
