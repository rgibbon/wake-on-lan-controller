FROM node:lts-alpine
WORKDIR /server

COPY --chown=node:node package*.json ./

RUN apk add --no-cache tzdata
ENV TZ=America/Toronto

RUN apk update && apk upgrade
RUN npm install -g npm@latest
RUN npm install

USER node

CMD ["npm", "start"]
