FROM node:lts AS builder

RUN mkdir -p /app
WORKDIR /app

COPY . /app/

ARG NODE_ENV=docker2
ENV NODE_ENV=${NODE_ENV}

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/_site /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf