# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json & lock file first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server code
COPY . .

# Expose Cloud Run default port
EXPOSE 8080

# Tell Node to listen on environment-defined port
ENV PORT 8080

# Start your server
CMD ["npm", "start"]
