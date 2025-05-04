FROM node:lts-alpine

ARG ENVIRONMENT

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=$ENVIRONMENT

WORKDIR /home/node/nodejs-social-network/src

COPY ["package*.json", "/home/node/nodejs-social-network/"]

RUN npm i

RUN npm i -g pm2

COPY [".", "/home/node/nodejs-social-network/"]

# CMD ["pm2-runtime", "ecosystem.local.config.js"]

CMD ["npm", "run", "start:dev"]

EXPOSE 3620