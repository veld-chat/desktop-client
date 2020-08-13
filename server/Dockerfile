FROM node:buster

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .babelrc .
COPY tsoa.json .

RUN yarn

COPY assets assets
COPY src src
RUN yarn build
RUN yarn api

# Start
CMD [ "node", "dist/server" ]
EXPOSE 1234