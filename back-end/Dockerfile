# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Instala pnpm globalmente
RUN npm install -g pnpm

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json pnpm-lock.yaml* ./

# Install app dependencies
RUN pnpm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm run build

# Expone el puerto 3000
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["pnpm", "run", "start:prod"]
