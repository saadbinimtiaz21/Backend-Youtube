#1. Base Image
FROM node:18-alpine

#2. Set Working Directory
WORKDIR /Youtube-Backend

#3. Copy package.json and package-lock.json
COPY package*.json ./

#4. Install Dependencies
RUN npm install --production

#5. Copy Application Code
COPY . .

#6. Expose Port
EXPOSE 3001

#7. Start the Application
CMD ["npm" , "run", "dev"]