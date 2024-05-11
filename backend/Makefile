OS	= $(shell uname -s)
ifeq ($(OS),Linux)
	CURRENT_PATH = $(shell pwd)
endif
ifeq ($(OS),Darwin)
	CURRENT_PATH = ${PWD}
endif

FRONT_NAME = eurovision-back
PORT = 9000

DOCKER_CMD = docker run --rm -it
DOCKER_APP_V = -v ${CURRENT_PATH}/:/app -w /app
DOCKER_IMG_BACK = node:current-alpine3.16

install:
	${DOCKER_CMD} --name ${FRONT_NAME}_installer --entrypoint=npm ${DOCKER_IMG_BACK} install

run:
	$(DOCKER_CMD) --name ${FRONT_NAME} -p ${PORT}:${PORT} ${DOCKER_APP_V} --entrypoint=npm -e PORT=${PORT} ${DOCKER_IMG_BACK} run dev

build:
	${DOCKER_CMD} --name ${FRONT_NAME}_builder ${DOCKER_APP_V} --entrypoint=npm ${DOCKER_IMG_BACK} run build

run_build:
	docker run -d --restart=always --name ${FRONT_NAME} -p ${PORT}:${PORT} ${DOCKER_APP_V} --entrypoint=node ${DOCKER_IMG_BACK} dist/index.js

stop:
	docker stop ${FRONT_NAME}

remove:
	docker rm -f ${FRONT_NAME}

terminal:
	$(DOCKER_CMD) --name ${FRONT_NAME}_terminal ${DOCKER_APP_V} --entrypoint=/bin/sh ${DOCKER_IMG_BACK}
