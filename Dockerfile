FROM node:15.2.0-alpine

WORKDIR /usr/src/app/beoad

COPY package*.json ./

run npm install

COPY . .

EXPOSE 3001

CMD ["npm","start"]