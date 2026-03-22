FROM node:20-alpine
WORKDIR /app

# Step 1: Install dependencies (Cached separately)
COPY package*.json ./
RUN npm install

# Step 2: Copy your source code
COPY . .

# Step 3: Serve the app in development mode
# This avoids the "next build" timeout issues on machines with limited RAM.
EXPOSE 3000
CMD ["npm", "run", "dev"]
