OS	= $(shell uname -s)
ifeq ($(OS),Linux)
	CURRENT_PATH = $(shell pwd)
endif
ifeq ($(OS),Darwin)
	CURRENT_PATH = ${PWD}
endif

include .env

FRONT_NAME = eurovision-back

DOCKER_CMD = docker run --rm -it
DOCKER_APP_V = -v ${CURRENT_PATH}/:/app -w /app
DOCKER_IMG_BACK = node:current-alpine3.16

DEPENDENCIES = \
	$(shell find ./index.ts -type f) \
	$(shell find ./*.json -type f) \
	$(shell find ./src -type f) \
	$(shell find ./public -type f) \
	$(shell find ./Makefile.prod -type f) \
	$(shell find ./db -type f)

RELEASE=./dist

install:
	${DOCKER_CMD} --name ${FRONT_NAME}_installer --entrypoint=npm ${DOCKER_IMG_BACK} install

run:
	$(DOCKER_CMD) --name ${FRONT_NAME} -p ${PORT}:${PORT} ${DOCKER_APP_V} --entrypoint=npm -e PORT=${PORT} ${DOCKER_IMG_BACK} run dev

build: $(RELEASE)

$(RELEASE): $(DEPENDENCIES)
	${DOCKER_CMD} --name ${FRONT_NAME}_builder ${DOCKER_APP_V} --entrypoint=npm ${DOCKER_IMG_BACK} run build

run_build: build
	docker run -d --restart=always --name ${FRONT_NAME} -p ${PORT}:${PORT} -v ${CURRENT_PATH}/dist/:/app -w /app --entrypoint=node ${DOCKER_IMG_BACK} index.js

stop:
	docker stop ${FRONT_NAME}

remove:
	docker rm -f ${FRONT_NAME}

terminal:
	$(DOCKER_CMD) --name ${FRONT_NAME}_terminal ${DOCKER_APP_V} --entrypoint=/bin/sh ${DOCKER_IMG_BACK}

clean:
	rm -rf dist
