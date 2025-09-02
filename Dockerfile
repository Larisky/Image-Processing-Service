# Use Alpine Node image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install OS dependencies needed by Prisma (esp. for Alpine)
RUN apk add --no-cache openssl

# Copy only package files and prisma schema (better caching)
COPY package*.json tsconfig.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy the rest of your source
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Expose API port
EXPOSE 4000

# Default command (will be overridden in docker-compose for dev)
CMD ["npm", "run", "dev"]
