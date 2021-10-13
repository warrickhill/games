locals {
  url = "games.${var.domain}"
}

resource "aws_s3_bucket" "game_bucket" {
  provider = aws.use1
  tags = merge(
    local.base_tags,
    {
      "Name" = "${var.environment}-cf-s3-website-${local.url}-s3-bucket"
    },
  )

  bucket = "${local.url}-bucket"
  acl    = "public-read"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "random_string" "game_user_agent_password" {
  length  = 32
  special = false
}

data "aws_iam_policy_document" "game_access" {
  provider = aws.use1
  statement {
    sid = "CloudFrontUserAgent"

    effect = "Allow"

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.game_bucket.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:UserAgent"

      values = [random_string.game_user_agent_password.result]
    }
  }
}

resource "aws_s3_bucket_policy" "game_access" {
  provider = aws.use1
  bucket   = aws_s3_bucket.game_bucket.id
  policy   = data.aws_iam_policy_document.game_access.json
}

resource "aws_cloudfront_distribution" "game_distribution" {
  provider = aws.use1
  tags = merge(
    local.base_tags,
    {
      "Name" = "${var.environment}-cf-s3-website-${local.url}-distribution"
    },
  )

  aliases             = [local.url]
  comment             = "Distribution for the ${local.url} S3 hosted website"
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = false
  price_class         = "PriceClass_All"
  web_acl_id          = ""

  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
    ]

    cached_methods = [
      "GET",
      "HEAD",
    ]

    compress    = true
    default_ttl = "86400"

    forwarded_values {
      cookies {
        forward           = "none"
        whitelisted_names = []
      }

      query_string            = false
      query_string_cache_keys = []
    }

    max_ttl                = "31536000"
    min_ttl                = "0"
    target_origin_id       = local.url
    viewer_protocol_policy = "redirect-to-https"

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.react_url_rewrite.qualified_arn
      include_body = false
    }
  }

  origin {
    domain_name = aws_s3_bucket.game_bucket.website_endpoint

    custom_header {
      name  = "User-Agent"
      value = random_string.game_user_agent_password.result
    }

    origin_id   = local.url
    origin_path = ""

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 60
      origin_read_timeout      = 60
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cf_website.arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_ssm_parameter" "game_cf" {
  name = "game-cf"

  tags = merge(
    local.base_tags,
    map(
      "Name", "${var.environment}-game-cf-ssm"
    )
  )

  type  = "String"
  value = aws_cloudfront_distribution.game_distribution.id
}

resource "aws_route53_record" "game_distribution_dns" {
  name    = local.url
  records = [aws_cloudfront_distribution.game_distribution.domain_name]
  ttl     = "60"
  type    = "CNAME"
  zone_id = aws_route53_zone.public_dns.zone_id
}

module "game_files" {
  source = "hashicorp/dir/template"

  base_dir = "${path.module}/../dist/apps/games"
}

resource "aws_s3_bucket_object" "static_files" {
  provider = aws.use1
  
  for_each = module.game_files.files

  bucket       = aws_s3_bucket.game_bucket.bucket
  key          = each.key
  content_type = each.value.content_type

  # The template_files module guarantees that only one of these two attributes
  # will be set for each file, depending on whether it is an in-memory template
  # rendering result or a static file on disk.
  source  = each.value.source_path
  content = each.value.content

  # Unless the bucket has encryption enabled, the ETag of each object is an
  # MD5 hash of that object.
  etag = each.value.digests.md5
}
