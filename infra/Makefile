.PHONY: up down setup deploy-staging deploy-prod health logs scale-queue backup observability

ENV ?= .env
COMPOSE = docker compose --env-file $(ENV)

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

setup:
	./scripts/setup.sh $(ENV)

deploy-staging:
	./scripts/deploy.sh staging

deploy-prod:
	./scripts/deploy.sh production

health:
	./scripts/healthcheck.sh $(ENV)

logs:
	$(COMPOSE) logs -f gateway api queue scheduler

scale-queue:
	./scripts/scale-queue.sh $(N) $(ENV)

backup:
	$(COMPOSE) --profile backup up -d backup

observability:
	$(COMPOSE) -f docker-compose.yml -f docker-compose.observability.yml --profile observability up -d
