resource "aws_route53_zone" "public_dns" {
  name = var.domain

  tags = merge(
    local.base_tags,
    {
      "Name" = "${var.environment}-public-dns"
    },
  )
}
