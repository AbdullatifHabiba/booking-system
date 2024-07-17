# Stage 1: Build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

ENV IGNORE_POSTINSTALL=true

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
# Generate Prisma client


FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 3000

# Generate Prisma client
RUN npx prisma generate --schema=./app/db/prisma/schema.local.prisma

# Start the application
CMD ["npm", "run", "start:migrate:prod"]
