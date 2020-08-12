FROM node:buster

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .babelrc .

RUN yarn

COPY assets assets
COPY src src
RUN yarn build

# Start
CMD [ "node", "dist/server" ]
EXPOSE 1234