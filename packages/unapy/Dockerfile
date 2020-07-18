FROM node:current-stretch

RUN mkdir -p /uno/unapy

WORKDIR /uno/unapy

COPY ./package.json /uno/unapy
COPY ./package-lock.json /uno/unapy

ENV NODE_ENV production

RUN npm ci

COPY . /uno/unapy

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "start" ]