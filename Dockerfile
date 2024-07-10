FROM node:18-alpine

WORKDIR /usr/src/app/dist/main

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]