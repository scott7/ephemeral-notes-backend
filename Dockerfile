# Use an official Node.js runtime as the base image
FROM node:22
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install application dependencies
RUN npm ci
# Copy the rest of the application code
COPY . .
COPY config .env
# Specify the command to run your application
CMD ["node", "app.js"]