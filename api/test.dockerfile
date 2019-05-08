FROM node:lts-alpine

ENV PRODUCTION true
WORKDIR /home/node/app
COPY . .
RUN chmod -R 777 /home/node/app
USER node
RUN ls
RUN mkdir -p uploads
RUN npm install
CMD ./wait-for-it.sh db:5432 -- npm test
# CMD npm test
# CMD npm test && npm run report
