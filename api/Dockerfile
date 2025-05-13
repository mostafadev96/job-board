FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY . .

EXPOSE 3000

COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]
