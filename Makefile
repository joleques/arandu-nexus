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

check:
	npm run lint
	npm run test
	npm run build
