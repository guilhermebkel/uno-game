FROM node:current-stretch

RUN mkdir -p /uno

WORKDIR /uno

COPY . /uno

RUN npm install

RUN npm run install:unapy

RUN npm run bootstrap

RUN npm run build:unapy

ENV PORT 80

ENV NODE_ENV production

EXPOSE 80 3667

CMD [ "npm", "run", "start:unapy" ]