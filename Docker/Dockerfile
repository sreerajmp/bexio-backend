FROM node:22.13.0-slim

WORKDIR /usr/src/app

COPY files .

RUN npm install
RUN npx prisma migrate deploy 
RUN npm run build
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
