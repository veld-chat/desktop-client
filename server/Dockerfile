FROM node:12.17.0

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

# Start
CMD [ "node", "dist/server" ]
EXPOSE 1234