FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4200

CMD ["npm", "run", "web:start"]