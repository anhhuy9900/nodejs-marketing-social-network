FROM node:lts-alpine

ARG ENVIRONMENT

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=$ENVIRONMENT

WORKDIR /home/node/nodejs-facebook/src

COPY ["package*.json", "/home/node/nodejs-facebook/"]

RUN npm i

RUN npm i -g pm2

COPY [".", "/home/node/nodejs-facebook/"]

# CMD ["pm2-runtime", "ecosystem.local.config.js"]

CMD ["npm", "run", "start:dev"]

EXPOSE 3620