FROM node:18-alpine

RUN apk add --no-cache curl openssl openssl-dev

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npx prisma generate

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm start"]
