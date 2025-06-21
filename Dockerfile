FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run build && npm run dev"]
