.PHONY: install dev build lint test start check

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

start:
	npm run start

run-dev:
	rm -rf .next
	npm run build
	npm run dev

check:
	npm run lint
	npm run test
	npm run build
