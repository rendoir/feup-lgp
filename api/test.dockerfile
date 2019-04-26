FROM node:lts-alpine

ENV PRODUCTION true
WORKDIR /home/node/app
COPY . .
RUN chmod -R 777 /home/node/app
USER node
RUN mkdir -p uploads
RUN npm install
CMD npm test
# CMD npm test && npm run report
