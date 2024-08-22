FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN pnpm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
