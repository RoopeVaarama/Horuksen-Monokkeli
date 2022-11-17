FROM node:16.17.1 as base

ARG REACT_APP_BACKEND_URL

ENV NODE_ENV=production
ENV CI=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

WORKDIR /client

COPY package.json package-lock.json /client/

RUN npm install

COPY . .

FROM base as test
RUN npm test

FROM base as build
RUN npm run build

FROM nginx:stable-alpine as prod
COPY --from=build /client/build /var/www/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD nginx -g "daemon off;"
