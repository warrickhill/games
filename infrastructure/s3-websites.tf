
data "aws_iam_policy_document" "react_lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "react_lambda_role" {
  assume_role_policy = data.aws_iam_policy_document.react_lambda.json
}

resource "aws_iam_role_policy_attachment" "lambda_exec" {
  role       = aws_iam_role.react_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "react_rewrite" {
  type        = "zip"
  output_path = "${path.module}/.zip/rewrite.zip"

  source {
    filename = "lambda.js"
    content  = file("${path.module}/react-url-rewrite-lambda.js")
  }
}

resource "aws_lambda_function" "react_url_rewrite" {
  provider         = aws.use1
  function_name    = "react-url-rewrite"
  filename         = data.archive_file.react_rewrite.output_path
  source_code_hash = data.archive_file.react_rewrite.output_base64sha256
  role             = aws_iam_role.react_lambda_role.arn
  runtime          = "nodejs10.x"
  handler          = "lambda.handler"
  memory_size      = 128
  timeout          = 3
  publish          = true
}


resource "aws_acm_certificate" "cf_website" {
  provider = aws.use1

  tags = merge(
  local.base_tags,
  {
    "Name" = "${var.environment}-cf-s3-website-cert-wildcard"
  },
  )

  domain_name       = "*.${var.domain}"
  validation_method = "DNS"
}

resource "aws_route53_record" "cf_website_validation_record" {

  depends_on = [aws_acm_certificate.cf_website]
  for_each = {
  for dvo in aws_acm_certificate.cf_website.domain_validation_options : dvo.domain_name => {
    name   = dvo.resource_record_name
    record = dvo.resource_record_value
    type   = dvo.resource_record_type
  }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.public_dns.zone_id
}

resource "aws_acm_certificate_validation" "cf_website_validation" {
  provider = aws.use1

  depends_on = [
    aws_acm_certificate.cf_website,
    aws_route53_record.cf_website_validation_record,
  ]

  certificate_arn         = aws_acm_certificate.cf_website.arn
  validation_record_fqdns = [for record in aws_route53_record.cf_website_validation_record : record.fqdn]
}
