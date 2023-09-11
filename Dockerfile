FROM node:19

# Create and set the working directory for the application
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of the application's files into the container
COPY .env ./.env
COPY tsconfig.json .
COPY src .

# Start the application in production mode when the container starts
CMD [ "npm", "run", "prod" ]
