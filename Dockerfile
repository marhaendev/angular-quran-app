# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production app
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/quran-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
