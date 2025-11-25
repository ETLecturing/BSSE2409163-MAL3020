FROM node:20

WORKDIR /app

# Only copy package files first
COPY package*.json ./

# Clean install inside container
RUN npm install

# Then copy source code
COPY . .

CMD ["npm", "run", "dev", "--", "host"]
