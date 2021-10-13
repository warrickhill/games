provider "aws" {
  profile = "hikingduck"
  region  = var.region
}

provider "aws" {
  alias   = "use1"
  profile = "hikingduck"
  region  = "us-east-1"
}

provider "random" {
  version = "~> 2.0"
}

provider "template" {
  version = "~> 2.1"
}
