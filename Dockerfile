FROM node:current-stretch

RUN mkdir -p /uno

WORKDIR /uno

COPY . /uno

ENV NODE_ENV production

RUN npm install

RUN npm install -g lerna

RUN npm run bootstrap

RUN npm run build:unapy

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "start:unapy" ]