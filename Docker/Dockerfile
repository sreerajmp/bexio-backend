FROM node:22.13.0-slim

WORKDIR /usr/src/app

COPY files .

RUN npm install

EXPOSE 3000 5000

CMD [ "npm", "run", "start" ]
