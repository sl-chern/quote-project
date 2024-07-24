variable "s3-endpoint" {
  type    = string
  default = "https://s3.localhost.localstack.cloud:4566"
}

variable "s3-bucket-name" {
  type    = string
  default = "static-files-bucket-quotes"
}

variable "backend_registry_name" {
  type    = string
  default = "backend_deploy"
}

variable "frontend_registry_name" {
  type    = string
  default = "frontend_deploy"
}