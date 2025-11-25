FROM node:20

WORKDIR /app

# Force npm to rebuild native modules for Linux
ENV npm_config_build_from_source=true

# Make sure old lockfiles don't poison Linux builds
COPY package*.json ./

RUN npm install

# Now copy project source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
