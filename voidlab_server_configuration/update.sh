#!/bin/sh
docker-compose pull
docker-compose down
docker-compose build
docker-compose up -d
