provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

module "buckets" {
  source         = "./buckets"
  s3-bucket-name = var.s3-bucket-name
}

module "registries" {
  source                 = "./registries"
  backend_registry_name  = var.backend_registry_name
  frontend_registry_name = var.frontend_registry_name
}
