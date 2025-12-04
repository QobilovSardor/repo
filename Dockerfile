FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY components.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY eslint.config.js ./
COPY index.html ./
COPY vite.config.ts ./
COPY .env ./

RUN npm run build && npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
