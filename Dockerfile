FROM node:15.12.0-alpine3.10

RUN adduser -S captain

COPY ./ /app
WORKDIR /app

RUN npm ci

RUN chown -R captain /opt/app

USER captain

EXPOSE 4000

CMD ["npm", "run", "start"]