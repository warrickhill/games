validate:
	@echo "Validate"
	@echo "--------"
	@terraform validate
	@echo ""

format:
	@echo "Format"
	@echo "--------"
	@terraform fmt
	@echo ""

plan:
	@echo ""
	@echo "Running a plan for live"
	@echo "============================="
	@echo ""
	@#$(MAKE) git-checkout
	@#$(MAKE) git-pull
	@$(MAKE) update-terraform-modules
	@terraform plan -var-file=terraform.tfvars -out=output/terraform.tfplan -state=output/terraform.tfstate
	@echo ""
	@echo "To deploy"
	@echo "======================="
	@echo ""
	@echo "Run: make apply"
	@echo ""

apply:
	@echo ""
	@echo "Apply a live build"
	@echo "========================"
	@echo ""
	@terraform apply -var-file=terraform.tfvars -state=output/terraform.tfstate -auto-approve
	@$(MAKE) git-commit-push
	@echo ""

destroy:
	@echo ""
	@echo "Destroy a live build"
	@echo "========================"
	@echo ""
	@terraform destroy -var-file=terraform.tfvars -state=output/terraform.tfstate -auto-approve
	@#$(MAKE) git-commit-push
	@echo ""

git-checkout:
	@echo "Switch to master"
	@echo "----------------"
	@git checkout main
	@echo ""

git-pull:
	@echo "Update local copy of this repo"
	@echo "------------------------------"
	@git pull
	@echo ""

git-commit-push:
	@echo "Update remote copy of this repo"
	@echo "-------------------------------"
	@git commit -am "Deploying [ci skip]"
	@git push
	@echo ""

update-terraform-modules:
	@echo "Update terraform modules"
	@echo "------------------------"
	@terraform init -upgrade
	@echo ""
