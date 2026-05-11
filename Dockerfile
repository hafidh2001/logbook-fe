# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Delete lockfile and reinstall to fix optional dependency issue on Alpine
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Set build-time environment variables
# These must be provided during docker build using --build-arg
ARG VITE_DECRYPT_SECRET_KEY
ARG VITE_API_URL
ARG VITE_API_TOKEN
ARG VITE_JWT_SECRET

ENV VITE_DECRYPT_SECRET_KEY=${VITE_DECRYPT_SECRET_KEY}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_TOKEN=${VITE_API_TOKEN}
ENV VITE_JWT_SECRET=${VITE_JWT_SECRET}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]