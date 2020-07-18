FROM node:current-stretch

RUN mkdir -p /usr/src/unapy

WORKDIR /usr/src/unapy

COPY ./package.json /usr/src/unapy
COPY ./package-lock.json /usr/src/unapy

ENV NODE_ENV production

RUN npm ci

COPY . /usr/src/unapy

RUN npm run build

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "start" ]