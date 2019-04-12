FROM alpine:latest

RUN sed -i -e 's/v[[:digit:]]\.[[:digit:]]/edge/g' /etc/apk/repositories
RUN apk upgrade --update-cache --available

RUN apk update
RUN apk add docker
RUN apk add openrc
RUN apk add py-pip python-dev libffi-dev openssl-dev gcc libc-dev make
RUN pip install --upgrade pip
RUN pip install docker-compose
RUN rc-update add docker boot
RUN apk add npm
# RUN npm install -g @angular/cli
# RUN npm install -g apidoc
RUN apk add openssh-client
