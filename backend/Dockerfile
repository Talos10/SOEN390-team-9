FROM node:12.20.1-alpine AS base
RUN apk add --no-cache bash
WORKDIR /app

FROM base AS development
COPY package.json ./

RUN npm install --only=prod
RUN cp -R node_modules /tmp/node_modules

RUN npm install
COPY . .

FROM development as develop
EXPOSE 5000
CMD ["npm", "start"]

FROM development as builder
RUN npm install
RUN npm run build

FROM base as release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "start:prod"]
