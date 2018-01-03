FROM node:9.3.0

WORKDIR /usr/src/bodhi/bodhi-ui

COPY package.json yarn.lock ./

RUN npm install

RUN yarn install

COPY . .

RUN yarn build

RUN yarn global add serve
