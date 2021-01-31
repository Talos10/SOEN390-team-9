FROM node:12.20.1-alpine

WORKDIR /code

COPY package.json /code
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
RUN npm install

COPY . /code

EXPOSE 5000

CMD ["npm", "start"]