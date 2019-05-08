#!/bin/sh
echo "version: '3.7'

services:
  db:
    image: registry.gitlab.com/alexandreaam/lgp-3a/db:$1
  apitest:
    image: registry.gitlab.com/alexandreaam/lgp-3a/apitest:$1
    environment:
      - DB_HOST=db
    depends_on:
      - db
    command:
      - ./wait-for-it.sh db:5432 -- npm test
  " >> docker-compose.yml
