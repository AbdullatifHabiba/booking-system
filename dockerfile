# create node docker image   
FROM node:12.18.3-alpine as build

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# build app
RUN npm run build

# create nginx docker image
FROM nginx:1.19.0-alpine

# copy build files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# expose port 3000
EXPOSE 3000

# start nginx

CMD ["nginx", "-g", "daemon off;"]

