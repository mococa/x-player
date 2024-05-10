deploy:
	pulumi up --stack mococa/$(stack)/$(environment) --cwd src/stacks/$(stack)

destroy:
	pulumi down --stack mococa/$(stack)/$(environment) --cwd src/stacks/$(stack)

refresh:
	pulumi refresh --stack mococa/$(stack)/$(environment) --cwd src/stacks/$(stack)

deploy-api:
	pulumi up --stack mococa/x-player-api/$(environment) --cwd src/stacks/api