FROM node:current-stretch

RUN mkdir -p /uno/src/unapy

WORKDIR /uno/src/unapy

COPY ./package.json /uno/src/unapy
COPY ./package-lock.json /uno/src/unapy

ENV NODE_ENV production

RUN npm ci

COPY . /uno/src/unapy

RUN npm run build

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "start" ]