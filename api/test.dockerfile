FROM node:lts-alpine

ENV PRODUCTION true
ARG POSTGRES_PASSWORD
WORKDIR /home/node/app
RUN apk add --no-cache postgresql-client
COPY . .
RUN chmod -R 777 /home/node/app
USER node
RUN npm install
RUN mkdir -p uploads
CMD ./wait-for-postgres.sh db $POSTGRES_PASSWORD npm test
# CMD npm test && npm run report
