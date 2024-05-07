OS	= $(shell uname -s)
ifeq ($(OS),Linux)
	CURRENT_PATH = $(shell pwd)
endif
ifeq ($(OS),Darwin)
	CURRENT_PATH = ${PWD}
endif

FRONT_NAME = eurovision-front
PORT_FRONT = 8000

DOCKER_CMD = docker run --rm -it
DOCKER_APP_V = -v ${CURRENT_PATH}/:/app -w /app
DOCKER_IMG_FRONT = node:current-alpine3.16

install:
	${DOCKER_CMD} --name ${FRONT_NAME}_installer --entrypoint=npm ${DOCKER_IMG_FRONT} install

run_front:
	$(DOCKER_CMD) --name ${FRONT_NAME} -p ${PORT_FRONT}:${PORT_FRONT} ${DOCKER_APP_V} --entrypoint=npm -e PORT=${PORT_FRONT} ${DOCKER_IMG_FRONT} run dev

terminal_front:
	$(DOCKER_CMD) --name ${FRONT_NAME}_terminal ${DOCKER_APP_V} --entrypoint=/bin/sh ${DOCKER_IMG_FRONT}

build:
	$(DOCKER_CMD) --name ${FRONT_NAME}_build ${DOCKER_APP_V} --entrypoint=npm ${DOCKER_IMG_FRONT} run build

qr:
	docker run -it --rm jkutkut/py-qr ${shell hostname -I | awk '{print $$1}'}:${PORT_FRONT}
