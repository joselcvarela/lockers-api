FROM node:18-alpine

WORKDIR /app

RUN npm i -g pnpm@9

COPY package.json pnpm-lock.yaml .

RUN pnpm i

COPY . .

RUN pnpm run build

CMD pnpm run prod
