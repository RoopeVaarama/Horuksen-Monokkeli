FROM node:16.17.1 as base

RUN npm install -g @nestjs/cli

ENV NODE_ENV=production

WORKDIR /server

COPY package.json package-lock.json /server/

RUN npm install

COPY . .

FROM base as test
RUN npm install ts-jest
RUN npm install -g jest
RUN npm test

FROM base as build
RUN npm run build
EXPOSE 3001
CMD node ./dist/main.js