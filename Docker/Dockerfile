FROM node:22.13.0-slim

WORKDIR /usr/src/app

COPY files .

RUN npm install
RUN chmod +x /usr/src/app/start.sh 
# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the script before running the app
CMD ["/bin/sh", "-c", "/usr/src/app/start.sh && npm run start:prod"]