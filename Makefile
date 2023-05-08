OS	=	$(shell uname -s)
ifeq ($(OS),Linux)
	CURRENT_PATH = $(shell pwd)
endif
ifeq ($(OS),Darwin)
	CURRENT_PATH = ${PWD}
endif

FRONT_NAME = eurovision_front
PORT_FRONT = 5173 # 8080

BACK_NAME = eurovision_server
PORT_BACK = 9000

DOCKER_CMD = docker run --rm -it

# ---------------------------------------------------------------------

DOCKER_FRONT_CONFIG = -v ${PWD}/front/${FRONT_NAME}:/app -w /app
DOCKER_IMG_FRONT = node:current-alpine3.16

run_front:
	$(DOCKER_CMD) -p ${PORT_FRONT}:5173 ${DOCKER_FRONT_CONFIG} --entrypoint=npm ${DOCKER_IMG_FRONT} run dev

terminal_front:
	$(DOCKER_CMD) ${DOCKER_FRONT_CONFIG} --entrypoint=/bin/sh ${DOCKER_IMG_FRONT}

# ---------------------------------------------------------------------

DOCKER_BACK_CONFIG = -v ${PWD}/backend/${BACK_NAME}:/app -w /app


# ---------------------------------------------------------------------