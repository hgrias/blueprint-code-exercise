# Base image for Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json prisma ./
RUN npm install
RUN npm install -g prisma

# Copy project files
COPY . .

# Build Next.js
RUN npm run build

# Generate Prisma client
RUN npm run postinstall

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
