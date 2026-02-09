# 1. Use a stable Node.js base image(alpine =: lightweight → faster builds, smaller image)
FROM node:18-alpine 

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./
  
# 4. Install dependencies
RUN npm install --production

# 5. Copy rest of the backend code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 5000

# 7. Start the server
CMD ["npm", "start"]
