#!/bin/sh
echo "version: '3.7'

services:
  db:
    image: registry.gitlab.com/feup-tbs/ldso18-19/t2g2/db:$1
  apitest:
    image: registry.gitlab.com/feup-tbs/ldso18-19/t2g2/apitest:$1
    environment:
      - DB_HOST=db
  " >> docker-compose.yml
