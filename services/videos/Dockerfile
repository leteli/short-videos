FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN apk update && apk upgrade && apk add --no-cache git ffmpeg
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "run", "start:prod"]