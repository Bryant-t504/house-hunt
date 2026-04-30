# Stage 1: Build the React application
FROM --platform=linux/amd64 node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM --platform=linux/amd64 nginx:stable-alpine

# Copy the build output from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx config to handle React Router (client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
