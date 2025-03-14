FROM node:22.13.0-slim

WORKDIR /usr/src/app


RUN npm install

# Copy all other files after dependencies are installed
COPY . .

# Ensure start.sh is executable
RUN chmod +x /start.sh

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the script before running the app
CMD ["/bin/sh", "-c", "/start.sh && npm run start:prod"]
