FROM node:buster

WORKDIR /app
COPY package.json .
COPY tsconfig.json .

RUN yarn

COPY src src
RUN yarn build

# Start
CMD [ "node", "dist/server" ]
EXPOSE 1234