# Build Stage
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Default Nginx config usually works for SPA, but for Cloud Run we need to listen on $PORT
# Configuring Nginx to read PORT env var is tricky, simpler to use a custom template or serve
# Using a simple serve approach or just default nginx if we map port 8080.
# Cloud Run injects PORT, usually 8080. Nginx default is 80.
# We will use a simple sed hack to set port in nginx conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
