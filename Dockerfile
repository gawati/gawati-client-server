FROM node:alpine
WORKDIR /home/node/app
COPY package.json /home/node/app
RUN apk --no-cache add --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install
RUN apk del native-deps
COPY . /home/node/app
CMD node ./bin/www
EXPOSE 3000/tcp
USER node

