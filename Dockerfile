FROM node:16
WORKDIR /usr/src/
COPY package*.json ./
run npm i -D ts-node nodemon
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
