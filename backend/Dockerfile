FROM node:12.20.1-alpine

WORKDIR /code

COPY package.json /code
RUN npm install

COPY . /code

EXPOSE 5000

CMD ["npm", "start"]