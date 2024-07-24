resource "aws_s3_bucket" "static_files" {
  bucket        = var.s3-bucket-name
  force_destroy = true
  tags = {
    Name = "Static Files Bucket"
  }
}
