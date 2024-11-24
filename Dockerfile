FROM node:20-alpine

RUN npm i -g pnpm@9

COPY package.json .

RUN pnpm i

COPY dist .

RUN node dist/index.js
