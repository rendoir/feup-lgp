FROM node:lts-alpine

ENV PRODUCTION true
ARG POSTGRES_PASSWORD
WORKDIR /home/node/app
COPY . .
RUN chmod -R 777 /home/node/app
RUN apk add --no-cache bash
RUN apk add --no-cache postgresql-client
USER node
RUN mkdir -p uploads
RUN npm install
CMD ./wait-for-postgres.sh db $POSTGRES_PASSWORD npm test
# CMD npm test
# CMD npm test && npm run report
