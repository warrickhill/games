variable "domain" {
  description = "Domain name for public addressing."
  type        = string
}

variable "environment" {
  description = "The name of the environment, e.g. live, Development, etc."
  type        = string
}

variable "region" {
  description = "Where are we placing these assets"
  type        = string
}
